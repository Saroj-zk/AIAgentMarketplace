import React, { useEffect } from 'react';
import { Terminal, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import './Navbar.css';

const Navbar = () => {
    const { isConnected, account, username, disconnectWallet, loading } = useWallet();
    const location = useLocation();
    const navigate = useNavigate();

    // Identity is optional, no forced redirection

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Terminal size={22} color="#fff" />
                    <span>OpenAgent</span>
                </Link>

                <div className="nav-links">
                    <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>Marketplace</Link>
                    <Link to="/auctions" className={`nav-link ${location.pathname === '/auctions' ? 'active' : ''}`}>Auctions</Link>
                    <Link to="/sell" className={`nav-link ${location.pathname === '/sell' ? 'active' : ''}`}>Deploy</Link>
                </div>

                <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isConnected && (
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer'
                            }}>
                                {username ? `@${username}` : `${account.slice(0, 6)}...${account.slice(-4)}`}
                            </div>
                        </Link>
                    )}

                    {isConnected && !username && (
                        <Link to="/identity" style={{
                            fontSize: '11px',
                            color: 'var(--primary-color)',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            letterSpacing: '0.05em'
                        }}>
                            Claim Identity
                        </Link>
                    )}

                    <ConnectButton
                        client={client}
                        theme={"dark"}
                        connectButton={{
                            label: "Connect Wallet",
                            style: {
                                height: '42px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                background: 'var(--primary-color, #6366f1)',
                                color: '#fff'
                            }
                        }}
                        appMetadata={{
                            name: "OpenAgent",
                            url: "https://openagent.example.com",
                        }}
                    />

                    {isConnected && (
                        <button
                            className="btn btn-outline"
                            onClick={disconnectWallet}
                            style={{
                                width: '42px',
                                height: '42px',
                                padding: 0,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: 'rgba(255, 77, 77, 0.2)',
                                color: '#ff4d4d'
                            }}
                            title="Disconnect Session"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
