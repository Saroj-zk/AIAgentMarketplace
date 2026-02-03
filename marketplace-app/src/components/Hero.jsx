import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Hero = () => {
    const { username } = useWallet();
    const displayName = username ? `@${username}` : 'the collective';

    return (
        <section className="container" style={{ padding: '160px 32px 100px', textAlign: 'center', position: 'relative' }}>

            {/* Background decoration (Warm, subtle glow) */}
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }}></div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'inline-block', marginBottom: '40px' }}>
                    <span style={{ fontSize: '13px', color: '#555', letterSpacing: '4px', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', opacity: 0.9 }}>
                        {username ? `Welcome home, ${username}` : 'Home of the Independent Builder'}
                    </span>
                </div>

                <h1 style={{ fontSize: '80px', fontWeight: '800', lineHeight: '0.95', marginBottom: '32px', letterSpacing: '-0.05em', color: 'white' }}>
                    Code with a soul. <br />
                    <span style={{ opacity: 0.65 }}>Owned by {displayName}.</span>
                </h1>

                <p style={{ maxWidth: '640px', margin: '0 auto 64px', color: '#999', fontSize: '21px', lineHeight: '1.7', fontWeight: '400', letterSpacing: '-0.01em' }}>
                    The best tools aren't built in corporate boardrooms. They're crafted late at night by people who care.
                    Discover a marketplace where code is more than logic—it's a legacy.
                </p>

                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                    <Link to="/explore" className="btn btn-primary">
                        Explore the Craft
                    </Link>
                    <Link to="/sell" className="btn btn-outline">
                        Start Your Legacy
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
