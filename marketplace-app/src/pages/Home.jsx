import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import AgentCard from '../components/AgentCard';
import CommunityStory from '../components/CommunityStory';
import TrendingSection from '../components/TrendingSection';
import Features from '../components/Features';
import { useWallet } from '../context/WalletContext';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, HandHeart } from 'lucide-react';

const Home = () => {
    const { marketplaceAgents } = useWallet();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Get unique categories for filters
    const categories = useMemo(() => {
        const cats = marketplaceAgents.map(a => a.role);
        return ['All', ...new Set(cats)];
    }, [marketplaceAgents]);

    // Filtering & Sorting Logic
    const filteredAgents = useMemo(() => {
        let result = [...marketplaceAgents];

        // Search Filter
        if (searchQuery) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category Tab Filter
        if (activeTab !== 'All') {
            result = result.filter(a => a.role === activeTab);
        }

        // Sorting
        if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') result.reverse();

        return result;
    }, [marketplaceAgents, searchQuery, activeTab, sortBy]);

    return (
        <div className="animate-fade-in-up">
            <Hero />

            <TrendingSection agents={[...marketplaceAgents].reverse()} />

            {/* Marketplace Main Container */}
            <section className="container" style={{ paddingBottom: '140px' }}>

                {/* Header Section */}
                <div style={{ marginBottom: '64px', textAlign: 'center' }}>
                    <span className="section-label">THE COLLECTIVE CRAFT</span>
                    <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.05em' }}>Designed by Humans. <br /> Built for You.</h2>
                    <p style={{ color: '#777', maxWidth: '540px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                        Directly support the {marketplaceAgents.length} independent minds shaping the future of decentralized logic. No middleman. Just the craft.
                    </p>
                </div>

                {/* Toolbar: Search, Tabs, and Sort */}
                <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '20px', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Top Row: Search & Category Tabs */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                                <input
                                    type="text"
                                    placeholder="Search for an agent or a capability..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: '#000',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        padding: '16px 20px 16px 54px',
                                        color: 'white',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#555'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', background: '#000', padding: '5px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                {['All', 'Newest', 'Top Rated'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setSortBy(filter.toLowerCase().replace(' ', '_'))}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: sortBy.includes(filter.toLowerCase().split(' ')[0]) ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: sortBy.includes(filter.toLowerCase().split(' ')[0]) ? '#fff' : '#444',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Advanced Filters & Results Count */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '70%' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveTab(cat)}
                                        style={{
                                            background: activeTab === cat ? '#fff' : 'transparent',
                                            color: activeTab === cat ? '#000' : '#666',
                                            border: '1px solid',
                                            borderColor: activeTab === cat ? '#fff' : 'var(--border-color)',
                                            padding: '8px 20px',
                                            borderRadius: '100px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    {filteredAgents.length} PIECES DISCOVERED
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        color: '#fff',
                                        border: '1px solid var(--border-color)',
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="newest">Sort By: Newest</option>
                                    <option value="price_low">Sort By: Price (Low)</option>
                                    <option value="price_high">Sort By: Price (High)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responsive Grid for Agents */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredAgents.length > 0 ? (
                        filteredAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', border: '1px dashed #222', borderRadius: '32px' }}>
                            <p style={{ color: '#444', fontSize: '18px', fontWeight: '500' }}>No agents match this search. Try a different category?</p>
                            <button onClick={() => { setSearchQuery(''); setActiveTab('All'); }} style={{ marginTop: '20px', color: '#fff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700' }}>Reset discovery</button>
                        </div>
                    )}
                </div>

                {filteredAgents.length > 8 && (
                    <div style={{ textAlign: 'center', marginTop: '80px' }}>
                        <button className="btn btn-outline" style={{ padding: '0 64px' }}>
                            Discover More
                        </button>
                    </div>
                )}
            </section>

            {/* Narrative Sections */}
            <section style={{ background: '#080808', padding: '160px 0', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border-color)' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ maxWidth: '700px' }}>
                        <span className="section-label">THE COLLECTIVE PROMISE</span>
                        <h2 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.0', marginBottom: '32px', letterSpacing: '-0.05em' }}>
                            Independent. Unowned. <br /> Built with care.
                        </h2>
                        <p style={{ fontSize: '20px', color: '#888', lineHeight: '1.7', marginBottom: '56px' }}>
                            We didn't build this to be another platform. We built it to be a community.
                            A home where builders own their work and users have direct access to the most innovative minds in AI.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/sell" className="btn btn-primary">
                                Join as a Builder
                            </Link>
                            <Link to="/explore" className="btn btn-outline">
                                Meet the Collective
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Subtle visual: builder silhouette or just a glow */}
                <div style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            </section>

            <CommunityStory />
            <Features />
        </div>
    );
};

export default Home;
