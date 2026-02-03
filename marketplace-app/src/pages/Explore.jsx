import React, { useState, useMemo } from 'react';
import AgentCard from '../components/AgentCard';
import { useWallet } from '../context/WalletContext';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const Explore = () => {
    const { marketplaceAgents } = useWallet();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = marketplaceAgents.map(a => a.role);
        return ['All', ...new Set(cats)];
    }, [marketplaceAgents]);

    const filteredAgents = useMemo(() => {
        return marketplaceAgents.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || a.role === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [marketplaceAgents, searchQuery, activeCategory]);

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px' }}>

            <div style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <Sparkles size={14} />
                        <span>THE REGISTRY</span>
                    </div>
                    <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.05em' }}>Meet the minds.</h1>
                    <p style={{ color: '#888', maxWidth: '600px', fontSize: '20px', lineHeight: '1.6' }}>
                        Explore the full collection of autonomous agents, each crafted with precision by independent builders worldwide.
                    </p>
                </div>
                <div style={{ textAlign: 'right', display: 'none' }}>
                    {/* Could add a count or small graphic here */}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
                {/* Sidebar Filters */}
                <div style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '20px', fontWeight: '800' }}>DISCOVER</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                            <input
                                type="text"
                                placeholder="Find a specific soul..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#000',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '14px 16px 14px 44px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '20px', fontWeight: '800' }}>CATEGORIES</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        textAlign: 'left',
                                        background: activeCategory === cat ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        border: 'none',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        color: activeCategory === cat ? '#fff' : '#666',
                                        fontSize: '14px',
                                        fontWeight: activeCategory === cat ? '700' : '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#444', fontWeight: '700' }}>
                            {filteredAgents.length} RESULTS FOUND IN THE COLLECTIVE
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                        {filteredAgents.map(agent => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                    {filteredAgents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '160px 0', border: '1px dashed #222', borderRadius: '32px' }}>
                            <p style={{ color: '#444', fontSize: '18px', fontWeight: '500' }}>The registry is empty for this criteria.</p>
                            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} style={{ marginTop: '20px', color: '#fff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700' }}>Reset discovery</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
