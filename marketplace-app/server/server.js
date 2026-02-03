const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const AGENTS_FILE = path.join(__dirname, 'agents.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const AUCTIONS_FILE = path.join(__dirname, 'auctions.json');

// Ensure directories and files exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));
if (!fs.existsSync(AGENTS_FILE)) fs.writeFileSync(AGENTS_FILE, '[]');
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');
if (!fs.existsSync(AUCTIONS_FILE)) fs.writeFileSync(AUCTIONS_FILE, '[]');

// Config Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Storage Helpers
const read = (file) => JSON.parse(fs.readFileSync(file));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- API ---

// AGENTS
app.get('/api/agents', (req, res) => res.json(read(AGENTS_FILE)));

app.post('/api/agents', upload.single('image'), (req, res) => {
    const agents = read(AGENTS_FILE);
    const { id, name, role, price, currency, description, owner, github, model } = req.body;

    const newAgent = {
        id: id ? (typeof id === 'string' ? parseInt(id) : id) : Date.now(),
        name,
        role,
        price,
        currency: currency || 'ETH',
        description,
        github,
        model,
        owner,
        creator: owner,
        image: req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : '/assets/agent1.png',
        status: 'Active',
        dateCreated: new Date().toISOString()
    };

    agents.unshift(newAgent);
    write(AGENTS_FILE, agents);
    res.status(201).json(newAgent);
});

app.delete('/api/agents/:id', (req, res) => {
    try {
        const agents = read(AGENTS_FILE);
        const initialCount = agents.length;
        const updated = agents.filter(a => a.id.toString() !== req.params.id.toString());

        if (updated.length === initialCount) {
            return res.status(404).json({ error: 'Agent not found in registry' });
        }

        write(AGENTS_FILE, updated);
        res.json({ success: true });
    } catch (error) {
        console.error("Delete agent error:", error);
        res.status(500).json({ error: 'Failed to modify registry' });
    }
});

// USERS / IDENTITY
app.get('/api/users/:address', (req, res) => {
    const users = read(USERS_FILE);
    res.json(users[req.params.address.toLowerCase()] || null);
});

app.post('/api/users', (req, res) => {
    const users = read(USERS_FILE);
    const { address, username } = req.body;
    users[address.toLowerCase()] = { username, address };
    write(USERS_FILE, users);
    res.json({ success: true });
});

// AUCTIONS
app.get('/api/auctions', (req, res) => res.json(read(AUCTIONS_FILE)));

app.post('/api/auctions/bid', (req, res) => {
    const { auctionId, bidder, amount } = req.body;
    const auctions = read(AUCTIONS_FILE);
    const auction = auctions.find(a => a.id === auctionId);

    if (auction) {
        auction.highestBid = amount;
        auction.highestBidder = bidder;
        auction.bids = [...(auction.bids || []), { bidder, amount, time: new Date().toISOString() }];
        write(AUCTIONS_FILE, auctions);
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'Auction not found' });
});

// Stats (Admin)
app.get('/api/admin/stats', (req, res) => {
    const agents = read(AGENTS_FILE);
    res.json({
        totalAgents: agents.length,
        totalVolume: '142.5 ETH',
        activeUsers: '1,240',
        platformFees: '3.56 ETH'
    });
});

app.listen(PORT, () => console.log(`OpenAgent Backend: http://localhost:${PORT}`));
