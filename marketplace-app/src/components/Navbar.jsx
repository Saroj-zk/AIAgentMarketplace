import React, { useEffect } from 'react';
import { Search, Wallet, Terminal, User, ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import './Navbar.css';

const Navbar = () => {
    const { isConnected, account, username, connectWallet, disconnectWallet, loading } = useWallet();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirection Logic: If connected but no username, forced to claim identity
    useEffect(() => {
        if (!loading && isConnected && !username && location.pathname !== '/identity') {
            navigate('/identity');
        }
    }, [isConnected, username, location.pathname, navigate, loading]);

    const handleConnect = async () => {
        if (isConnected) {
            if (window.confirm('Disconnect session?')) {
                disconnectWallet();
                navigate('/');
                // Small delay to ensure state clears then reload for a clean environment
                setTimeout(() => window.location.reload(), 100);
            }
        } else {
            const success = await connectWallet();
            if (success) {
                // Connection is handled by useEffect for redirection
            }
        }
    };

    const shortenAddress = (addr) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

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

                <div className="nav-actions" style={{ display: 'flex', gap: '12px' }}>
                    <div
                        className={`btn ${isConnected ? 'btn-outline' : 'btn-primary'}`}
                        style={{ height: '42px', padding: '0 20px', fontSize: '13px', borderRadius: '12px', cursor: isConnected && username ? 'pointer' : 'default' }}
                        onClick={() => {
                            if (!isConnected) handleConnect();
                            else if (username) navigate('/dashboard');
                        }}
                    >
                        {isConnected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {username ? (
                                    <>
                                        <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', fontWeight: '800', color: '#fff' }}>
                                            @{username}
                                        </div>
                                        <span style={{ color: '#444' }}>|</span>
                                    </>
                                ) : (
                                    <ShieldCheck size={14} color="#ff4d4d" />
                                )}
                                <span style={{ opacity: 0.6 }}>{shortenAddress(account)}</span>
                            </div>
                        ) : (
                            <>
                                <Wallet size={16} style={{ marginRight: '8px' }} />
                                Connect Wallet
                            </>
                        )}
                    </div>

                    {isConnected && (
                        <button
                            className="btn btn-outline"
                            onClick={handleConnect}
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
