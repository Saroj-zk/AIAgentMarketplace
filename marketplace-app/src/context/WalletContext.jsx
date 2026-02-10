import React, { createContext, useState, useContext, useEffect } from 'react';
import { getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount, useConnect, useDisconnect } from "thirdweb/react";
import { client } from "../client";
import { defineChain } from "thirdweb/chains";
import { REGISTRY_ABI, CONTRACT_ADDRESS } from '../contracts';
import { toEther, toWei } from "thirdweb";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const activeAccount = useActiveAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const account = activeAccount?.address || null;
    const isConnected = !!activeAccount;

    const [username, setUsername] = useState(null);
    const [marketplaceAgents, setMarketplaceAgents] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Name Registry (for demo purposes, using localStorage)
    const [allTakenNames, setAllTakenNames] = useState(['admiral', 'satoshi', 'vitalik']);

    // Contract instance
    const contract = getContract({
        client,
        chain: defineChain(31337), // Assuming local hardhat, update as needed
        address: CONTRACT_ADDRESS,
        abi: REGISTRY_ABI,
    });

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

    // Sync username when account changes
    useEffect(() => {
        if (account) {
            const savedProfile = JSON.parse(localStorage.getItem(`profile_${account.toLowerCase()}`));
            if (savedProfile) {
                setUsername(savedProfile.name);
            } else {
                setUsername(null);
            }
        } else {
            setUsername(null);
        }
    }, [account]);

    const connectWallet = async () => {
        return true;
    };

    const disconnectWallet = () => {
        if (activeAccount) {
            disconnect(activeAccount.wallet);
        }
    };

    const saveUsername = async (newName) => {
        if (!account) return { success: false, error: 'No wallet connected' };

        const lowerName = newName.toLowerCase();
        if (allTakenNames.includes(lowerName)) {
            return { success: false, error: 'This name has already been claimed.' };
        }

        try {
            const transaction = prepareContractCall({
                contract,
                method: "claimIdentity",
                params: [newName],
            });

            await sendAndConfirmTransaction({
                transaction,
                account: activeAccount,
            });

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
            return { success: false, error: "Connection to registry server failed." };
        }
    };

    const buyAgent = async (agent) => {
        if (!isConnected) return { success: false, error: 'Connect wallet first' };

        try {
            const transaction = prepareContractCall({
                contract,
                method: "buyAgent",
                params: [BigInt(agent.id)],
                value: toWei(agent.price.toString()),
            });

            await sendAndConfirmTransaction({
                transaction,
                account: activeAccount,
            });

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
        if (!isConnected) return { success: false, error: 'Connect wallet first' };

        try {
            const transaction = prepareContractCall({
                contract,
                method: "placeBid",
                params: [BigInt(auctionId)],
                value: toWei(amount.toString()),
            });

            await sendAndConfirmTransaction({
                transaction,
                account: activeAccount,
            });

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
        if (!isConnected) return false;

        try {
            const transaction = prepareContractCall({
                contract,
                method: "listAgent",
                params: [toWei(agentData.price.toString())],
            });

            const receipt = await sendAndConfirmTransaction({
                transaction,
                account: activeAccount,
            });

            let onChainId = Date.now();

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
            loading,
            activeAccount,
            client,
        }}>
            {children}
        </WalletContext.Provider>
    );
};
