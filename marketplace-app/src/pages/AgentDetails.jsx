import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { CheckCircle, Shield, Zap, ArrowLeft, Download, Terminal, Code, Heart, User, Github, Cpu, ExternalLink, Package } from 'lucide-react';
import AgentAvatar from '../components/AgentAvatar';

const AgentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { marketplaceAgents, isConnected, username, account, buyAgent } = useWallet();
    const [isPurchasing, setIsPurchasing] = React.useState(false);
    const agent = marketplaceAgents.find(a => a.id.toString() === id);

    const handlePurchase = async () => {
        if (!isConnected) {
            alert('Please connect your wallet to deploy this entity.');
            return;
        }

        setIsPurchasing(true);
        const result = await buyAgent(agent);
        setIsPurchasing(false);

        if (result.success) {
            alert('Deployment successful! You now have control of this entity.');
            navigate('/explore');
        } else {
            alert(`Deployment failed: ${result.error}`);
        }
    };

    const isOwner = agent && (agent.owner === account || agent.owner === username);
    const ownerDisplay = isOwner && username ? `@${username}` : (agent?.owner ? `@${agent.owner.slice(0, 8)}` : '@builder');

    if (!agent) {
        return (
            <div className="container" style={{ padding: '160px 0', textAlign: 'center' }}>
                <Terminal size={48} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Agent Not Found</h2>
                <Link to="/explore" className="btn btn-primary" style={{ marginTop: '24px' }}>Return to Registry</Link>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px' }}>

            {/* Minimal Header Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px' }}>
                <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#555'}>
                    <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                    Back to Registry
                </Link>
                <div style={{ display: 'flex', gap: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>STATUS</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={14} /> LIVE ON CHAIN
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>VERSION</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>v2.4.0</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '80px', alignItems: 'start' }}>

                {/* Main Content Area */}
                <div>
                    <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.04em' }}>{agent.name}</h1>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
                        <span style={{ fontSize: '13px', color: '#888', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            {agent.role}
                        </span>
                        <span style={{ fontSize: '13px', color: '#888', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Cpu size={14} /> {agent.model || 'GPT-4o'}
                        </span>
                    </div>

                    <div style={{ maxWidth: '640px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '20px' }}>Capabilities</h3>
                        <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#888', marginBottom: '48px' }}>
                            {agent.description || "A high-performance autonomous agent optimized for complex decision-making and real-time execution. Built for precision and independence within the decentralized workspace."}
                        </p>

                        {/* GitHub Link Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '32px',
                            marginBottom: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '48px', height: '48px', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222' }}>
                                    <Github size={24} color="#fff" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Open Source Registry</h4>
                                    <p style={{ fontSize: '13px', color: '#555' }}>Fully verified repository on GitHub</p>
                                </div>
                            </div>
                            <a
                                href={agent.github || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '12px 24px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                className="hover-lift"
                            >
                                Browse Code <ExternalLink size={14} />
                            </a>
                        </div>

                        {/* Technical Specs Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <Package size={20} color="#444" style={{ marginBottom: '16px' }} />
                                <h5 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>What's included</h5>
                                <ul style={{ fontSize: '13px', color: '#666', padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li>• Complete Node.js / Python Source</li>
                                    <li>• Pre-trained Model Weights</li>
                                    <li>• Docker Deployment Scripts</li>
                                </ul>
                            </div>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <Shield size={20} color="#444" style={{ marginBottom: '16px' }} />
                                <h5 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>Security & Audit</h5>
                                <ul style={{ fontSize: '13px', color: '#666', padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li>• OpenAgent DAO Verified</li>
                                    <li>• Real-time Performance Tracking</li>
                                    <li>• Zero Proprietary Dependencies</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Sticky Card */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px' }}>

                        {/* Smaller, Profile-like Image */}
                        <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                            <AgentAvatar image={agent.image} name={agent.name} size="100%" />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>BUILDER PRICE</div>
                            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{agent.price} {agent.currency || 'ETH'}</div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', height: '56px', borderRadius: '12px', marginBottom: '16px' }}
                            disabled={isPurchasing}
                            onClick={handlePurchase}
                        >
                            <Download size={18} style={{ marginRight: '10px' }} />
                            {isPurchasing ? 'Processing...' : 'Buy & Deploy'}
                        </button>

                        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={14} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', color: '#444', fontWeight: '800', textTransform: 'uppercase' }}>Crafted By</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{ownerDisplay}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#333', fontWeight: '700', letterSpacing: '0.05em' }}>
                        DIRECT PROTOCOL TRANSFER. <br /> OWNERSHIP IS MINTED TO YOUR WALLET.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AgentDetails;
