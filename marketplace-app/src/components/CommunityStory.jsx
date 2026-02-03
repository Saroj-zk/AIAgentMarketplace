import React from 'react';
import { Hammer, UploadCloud, Banknote } from 'lucide-react';

const CommunityStory = () => {
    return (
        <section className="container" style={{ padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.8fr) 1fr', gap: '80px', alignItems: 'start' }}>

                {/* Left Column: The Manifesto (Sentimental/Strong) */}
                <div>
                    <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                        Software belongs to the <br /> people who build it.
                    </h3>
                    <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.7', marginTop: '0', maxWidth: '440px' }}>
                        For too long, the value of code has been captured by platforms, not creators.
                        <br /><br />
                        We're changing that. This is a marketplace where you own your work,
                        set your terms, and directly benefit from your ingenuity.
                    </p>
                </div>

                {/* Right Column: The Steps (Clean Vertical List, No Boxes) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* Step 1 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Hammer size={20} color="#fff" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Craft it yourself</h4>
                            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', margin: 0 }}>
                                Whether it's a simple script or a complex autonomous agent, bring your best work. No corporate roadmap, just your vision.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <UploadCloud size={20} color="#fff" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Share it freely</h4>
                            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', margin: 0 }}>
                                Publish to a global audience instantly. We don't gatekeep. We don't pick favorites. If it solves a problem, it belongs here.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Banknote size={20} color="#fff" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Earn what you deserve</h4>
                            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', margin: 0 }}>
                                Set your own price. Get paid directly. We exist to make indie development a viable career, not just a hobby.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default CommunityStory;
