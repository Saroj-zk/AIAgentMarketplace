import React, { useMemo } from 'react';
import { Gavel, Clock, ArrowRight, Terminal, User, Sparkles } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import AgentAvatar from '../components/AgentAvatar';

const Auctions = () => {
    const navigate = useNavigate();
    const { isConnected, auctions, loading } = useWallet();

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '200px', textAlign: 'center' }}>
                <Terminal size={48} className="animate-pulse" style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#333' }}>SYNCHRONIZING REGISTRY...</h2>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px' }}>

            <div style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <Terminal size={14} />
                        <span>ACTIVE SESSIONS</span>
                    </div>
                    <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.05em' }}>Auctions.</h1>
                    <p style={{ color: '#666', maxWidth: '600px', fontSize: '18px', lineHeight: '1.6' }}>
                        The high-stakes registry. Discover agents currently open for public bidding across the collective.
                    </p>
                </div>
            </div>

            {/* List Design */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {auctions.map((auction) => (
                    <div
                        key={auction.id}
                        onClick={() => navigate(`/auction/${auction.id}`)}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 1.5fr 1fr 1fr 1fr 60px',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            padding: '24px 32px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {/* Avatar */}
                        <div style={{ width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <AgentAvatar image={auction.image} name={auction.name} size="100%" />
                        </div>

                        {/* Identity */}
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{auction.name}</div>
                            <div style={{ fontSize: '12px', color: '#555', fontWeight: '700' }}>{auction.role}</div>
                        </div>

                        {/* Current Bid */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>Active Bid</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                                {auction.highestBid} {auction.currency}
                            </div>
                        </div>

                        {/* Timer */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>Ends In</div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#ff4d4d', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={14} /> {auction.timeLeft}
                            </div>
                        </div>

                        {/* Top Challenger */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>Top Challenger</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={10} color="#555" />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#888' }}>{auction.highestBidder}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <ArrowRight size={18} color="#fff" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                <p style={{ color: '#222', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em' }}>
                    PRIVATE KEYS & DATA PACKS ARE TRANSFERRED AUTOMATICALLY UPON SETTLEMENT.
                </p>
            </div>
        </div>
    );
};

export default Auctions;
