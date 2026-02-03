import React from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, Heart, Users } from 'lucide-react';
import AgentAvatar from './AgentAvatar';

const TrendingSection = ({ agents }) => {
    const trending = agents.length > 0 ? agents.slice(0, 4) : [];
    if (trending.length === 0) return null;

    return (
        <section className="container" style={{ marginBottom: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={20} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.04em' }}>The People's Choice</h3>
                </div>
                <Link to="/explore" style={{ fontSize: '13px', color: '#444', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#444'}>
                    FULL RANKINGS <MoveRight size={14} />
                </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                {trending.map((agent, i) => (
                    <Link key={agent.id} to={`/agent/${agent.id}`} style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 2fr 1fr 1fr 140px',
                        alignItems: 'center',
                        background: 'var(--bg-primary)',
                        padding: '28px 32px',
                        textDecoration: 'none',
                        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}>

                        <span style={{ fontSize: '20px', color: '#222', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>0{i + 1}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <AgentAvatar image={agent.image} name={agent.name} size="56px" style={{ borderRadius: '14px' }} />
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{agent.name}</div>
                                <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Heart size={12} fill="#555" color="#555" />
                                    Loved by {Math.floor(Math.random() * 200) + 50} community members
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: '15px', color: '#888', fontWeight: '600' }}>{agent.role}</div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#444', fontWeight: '800', textTransform: 'uppercase' }}>Sentiment</span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => <div key={i} style={{ width: '4px', height: '12px', background: i < 4 ? '#fff' : '#222', borderRadius: '1px' }}></div>)}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                            {agent.price} {agent.currency || 'ETH'}
                        </div>

                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingSection;
