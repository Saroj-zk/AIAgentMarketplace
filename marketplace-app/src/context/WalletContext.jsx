import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { REGISTRY_ABI, CONTRACT_ADDRESS } from '../contracts';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState(null);
    const [marketplaceAgents, setMarketplaceAgents] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Name Registry (for demo purposes, using localStorage)
    const [allTakenNames, setAllTakenNames] = useState(['admiral', 'satoshi', 'vitalik']);

    // Fetch data from backend on load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Agents
                const agentsRes = await fetch('http://localhost:3001/api/agents');
                const agentsData = await agentsRes.json();
                setMarketplaceAgents(agentsData);

                // Fetch Auctions
                const auctionsRes = await fetch('http://localhost:3001/api/auctions');
                const auctionsData = await auctionsRes.json();
                setAuctions(auctionsData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();

        const storedNames = JSON.parse(localStorage.getItem('registered_identities') || '["admiral", "satoshi", "vitalik"]');
        setAllTakenNames(storedNames);
    }, []);

    // Check if wallet is already connected and if identity exists
    useEffect(() => {
        const checkConnection = async () => {
            // Respect manual disconnect
            const isManuallyDisconnected = localStorage.getItem('manual_disconnect') === 'true';
            if (isManuallyDisconnected) return;

            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        const addr = accounts[0];
                        setAccount(addr);
                        setIsConnected(true);

                        // Check local storage for this specific account's username
                        const savedProfile = JSON.parse(localStorage.getItem(`profile_${addr.toLowerCase()}`));
                        if (savedProfile) {
                            setUsername(savedProfile.name);
                        }
                    }
                } catch (error) {
                    console.error("Error checking wallet connection:", error);
                }
            }
        };

        checkConnection();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    // Respect manual disconnect even on account change
                    if (localStorage.getItem('manual_disconnect') === 'true') return;

                    const addr = accounts[0];
                    setAccount(addr);
                    setIsConnected(true);

                    const savedProfile = JSON.parse(localStorage.getItem(`profile_${addr.toLowerCase()}`));
                    setUsername(savedProfile ? savedProfile.name : null);
                } else {
                    setAccount(null);
                    setIsConnected(false);
                    setUsername(null);
                }
            });
        }
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("MetaMask is not installed. Please install it to use this feature.");
            return false;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const addr = accounts[0];
            setAccount(addr);
            setIsConnected(true);

            // Clear manual disconnect flag
            localStorage.removeItem('manual_disconnect');

            // Re-check username for the newly connected account
            const savedProfile = JSON.parse(localStorage.getItem(`profile_${addr.toLowerCase()}`));
            if (savedProfile) {
                setUsername(savedProfile.name);
            }

            return true;
        } catch (error) {
            console.error("Failed to connect wallet", error);
            return false;
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
        setUsername(null);
        // Persist disconnect state
        localStorage.setItem('manual_disconnect', 'true');
    };

    const saveUsername = async (newName) => {
        if (!account || !window.ethereum) return { success: false, error: 'No wallet connected' };

        const lowerName = newName.toLowerCase();
        // Check local first for speed
        if (allTakenNames.includes(lowerName)) {
            return { success: false, error: 'This name has already been claimed.' };
        }

        try {
            // 1. Claim on-chain first
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, REGISTRY_ABI, signer);

            const tx = await contract.claimIdentity(newName);
            await tx.wait();

            // 2. Sync with backend
            const response = await fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: account, username: newName })
            });

            if (response.ok) {
                localStorage.setItem(`profile_${account.toLowerCase()}`, JSON.stringify({ name: newName }));
                setAllTakenNames(prev => [...prev, lowerName]);
                setUsername(newName);
                return { success: true };
            }
            return { success: false, error: 'Backend registry failed' };
        } catch (error) {
            console.error("Eth Identity Error:", error);
            return { success: false, error: error.message || 'On-chain identity claim failed' };
        }
    };

    const deleteAgent = async (id) => {
        try {
            console.log(`Attempting to remove agent ${id} from registry...`);
            const response = await fetch(`http://localhost:3001/api/agents/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setMarketplaceAgents(prev => prev.filter(a => a.id.toString() !== id.toString()));
                return { success: true };
            }
            const errData = await response.json().catch(() => ({}));
            return { success: false, error: errData.error || `Server responded with ${response.status}` };
        } catch (error) {
            console.error("Delete Agent Network Error:", error);
            return { success: false, error: "Connection to registry server failed. Is the backend running?" };
        }
    };

    const buyAgent = async (agent) => {
        if (!isConnected || !window.ethereum) return { success: false, error: 'Connect wallet first' };

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, REGISTRY_ABI, signer);

            // Execute on-chain transaction
            const tx = await contract.buyAgent(agent.id, {
                value: ethers.parseEther(agent.price.toString())
            });
            await tx.wait();

            const response = await fetch(`http://localhost:3001/api/agents/${agent.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMarketplaceAgents(prev => prev.filter(a => a.id !== agent.id));
                return { success: true };
            }
            return { success: false, error: 'Failed to update registry' };
        } catch (error) {
            console.error("Eth Transaction Error:", error);
            return { success: false, error: error.message || 'Transaction failed' };
        }
    };

    const placeBid = async (auctionId, amount) => {
        if (!isConnected || !window.ethereum) return { success: false, error: 'Connect wallet first' };

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, REGISTRY_ABI, signer);

            // Execute on-chain bid
            const tx = await contract.placeBid(auctionId, {
                value: ethers.parseEther(amount.toString())
            });
            await tx.wait();

            const response = await fetch('http://localhost:3001/api/auctions/bid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auctionId,
                    bidder: username || account,
                    amount
                })
            });

            if (response.ok) {
                // Refresh Auctions from backend
                const auctionsRes = await fetch('http://localhost:3001/api/auctions');
                const auctionsData = await auctionsRes.json();
                setAuctions(auctionsData);
                return { success: true };
            }
            return { success: false, error: 'Bid failed on backend' };
        } catch (error) {
            console.error("Eth Bid Error:", error);
            return { success: false, error: error.message || 'Bid transaction failed' };
        }
    };

    const addAgent = async (agentData, imageFile) => {
        if (!isConnected || !window.ethereum) return false;

        try {
            // 1. List on-chain first to get a permanent decentralized ID
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, REGISTRY_ABI, signer);

            // Note: Currently converting everything to ETH for the registry
            const tx = await contract.listAgent(ethers.parseEther(agentData.price.toString()));
            const receipt = await tx.wait();

            // Extract the on-chain ID from the logs
            let onChainId = Date.now(); // Fallback
            const listedEvent = receipt.logs.map(log => {
                try { return contract.interface.parseLog(log); } catch (e) { return null; }
            }).find(e => e && e.name === 'AgentListed');

            if (listedEvent) {
                onChainId = listedEvent.args.id;
            }

            // 2. Sync with backend registry
            const formData = new FormData();
            formData.append('id', onChainId.toString());
            formData.append('name', agentData.name);
            formData.append('role', agentData.role);
            formData.append('price', agentData.price);
            formData.append('currency', agentData.currency || 'ETH');
            formData.append('description', agentData.description);
            formData.append('github', agentData.github || '');
            formData.append('model', agentData.model || '');
            formData.append('owner', username || account);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch('http://localhost:3001/api/agents', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const newAgent = await response.json();
                setMarketplaceAgents(prev => [newAgent, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to deploy agent on-chain:", error);
            alert(`Deployment Error: ${error.message}`);
            return false;
        }
    };

    return (
        <WalletContext.Provider value={{
            account,
            username,
            isConnected,
            connectWallet,
            disconnectWallet,
            saveUsername,
            marketplaceAgents,
            auctions,
            addAgent,
            deleteAgent,
            buyAgent,
            placeBid,
            loading
        }}>
            {children}
        </WalletContext.Provider>
    );
};
