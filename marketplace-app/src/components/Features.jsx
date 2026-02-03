import React from 'react';
import { Home, Heart, Users, ShieldCheck } from 'lucide-react';

const Features = () => {
    return (
        <section className="container" style={{ paddingBottom: '160px', paddingTop: '120px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

            <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                <span className="section-label">OUR VALUES</span>
                <h3 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.05em' }}>The Builder's Creed</h3>
                <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: '1.7' }}>
                    We didn't build this to extract value. We built it to protect it.
                    These are the principles that guide our collective journey.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '32px', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={28} color="#fff" strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: '800' }}>Radical Transparency</h4>
                    <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7' }}>
                        Every agent is open to the community for review. No hidden hooks, no black boxes. We trust the code because we can see the soul within it.
                    </p>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '32px', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Home size={28} color="#fff" strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: '800' }}>Direct Distribution</h4>
                    <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7' }}>
                        When you buy an agent, the ETH goes directly to the builder's wallet. We take nothing. This is about sustaining creators, not platforms.
                    </p>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '32px', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={28} color="#fff" strokeWidth={1.5} />
                    </div>
                    <h4 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: '800' }}>Community Driven</h4>
                    <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7' }}>
                        The marketplace is governed by the people who use it. If there is a dispute, the community decides. This is software by the people, for the people.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Features;
