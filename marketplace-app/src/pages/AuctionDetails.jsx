import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Gavel, Clock, ArrowLeft, TrendingUp, User, ShieldCheck, Terminal, DollarSign, History } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import AgentAvatar from '../components/AgentAvatar';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isConnected, username, placeBid, auctions, loading } = useWallet();
    const [isBidding, setIsBidding] = useState(false);

    const auction = auctions.find(a => a.id.toString() === id.toString());

    // Mock Bid History (or use auction.bids if available)
    const bidHistory = useMemo(() => {
        if (!auction) return [];
        if (auction.bids && auction.bids.length > 0) {
            return [...auction.bids].reverse();
        }
        // Fallback for demo
        return [
            { id: 1, bidder: "@whale_watcher", amount: 14.50, time: "2 mins ago" },
            { id: 2, bidder: "@neural_mind", amount: 14.10, time: "8 mins ago" },
            { id: 3, bidder: "@satoshi", amount: 13.80, time: "15 mins ago" },
            { id: 4, bidder: "@builder_x", amount: 12.50, time: "42 mins ago" },
            { id: 5, bidder: "@early_adopter", amount: 10.00, time: "1 hour ago" },
        ].map(b => ({ ...b, amount: auction ? (auction.highestBid - (b.id - 1) * (auction.highestBid * 0.05)).toFixed(2) : b.amount }));
    }, [auction]);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '200px', textAlign: 'center' }}>
                <Terminal size={48} className="animate-pulse" style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#333' }}>SYNCHRONIZING LEDGER...</h2>
            </div>
        );
    }

    if (!auction) {
        return <div className="container" style={{ paddingTop: '200px', textAlign: 'center' }}><h2>Auction not found</h2></div>;
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px' }}>
            <Link to="/auctions" style={{ display: 'inline-flex', alignItems: 'center', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '48px' }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Leaderboard
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '80px', alignItems: 'start' }}>
                {/* Visual Sidebar */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
                        <AgentAvatar image={auction.image} name={auction.name} size="100%" />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Current High Bid</div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
                            {auction.highestBid} {auction.currency}
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', height: '56px', borderRadius: '12px' }}
                            disabled={isBidding}
                            onClick={async () => {
                                if (!isConnected) return alert('Connect wallet first');
                                setIsBidding(true);
                                const nextBid = (parseFloat(auction.highestBid) * 1.05).toFixed(2);
                                const res = await placeBid(auction.id, nextBid);
                                setIsBidding(false);
                                if (res.success) alert('Challenge recorded on ledger.');
                                else alert('Challenge failed.');
                            }}
                        >
                            <Gavel size={18} style={{ marginRight: '10px' }} />
                            {isBidding ? 'Recording...' : 'Place Bid'}
                        </button>
                    </div>
                </div>

                {/* Bid List / Leaderboard Details */}
                <div>
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ff4d4d', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
                            <Clock size={14} /> LIVE AUCTION
                        </div>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>{auction.name}</h1>
                        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>{auction.role}</p>
                    </div>

                    <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <History size={20} color="#fff" />
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Bid History</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden' }}>
                        {bidHistory.map((bid, index) => (
                            <div key={bid.id} style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 2fr 1fr 1fr',
                                alignItems: 'center',
                                padding: '24px 32px',
                                background: index === 0 ? 'rgba(255,255,255,0.02)' : 'var(--bg-primary)',
                                transition: 'all 0.3s'
                            }}>
                                <span style={{ fontSize: '14px', color: index === 0 ? '#fff' : '#333', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>
                                    {index === 0 ? 'WIN' : `0${index + 1}`}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={14} color={index === 0 ? "#fff" : "#444"} />
                                    </div>
                                    <span style={{ fontWeight: '700', color: index === 0 ? '#fff' : '#888' }}>{bid.bidder}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>{bid.time}</div>
                                <div style={{ textAlign: 'right', fontWeight: '800', color: index === 0 ? '#fff' : '#666', fontFamily: 'var(--font-mono)' }}>
                                    {bid.amount} {auction.currency}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetails;
