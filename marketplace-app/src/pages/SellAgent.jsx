import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Upload, DollarSign, Bot, FileText, CheckCircle, AlertCircle, Sparkles, Terminal, Github, Cpu, Link as LinkIcon, Info, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellAgent = () => {
    const { isConnected, addAgent, username } = useWallet();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        price: '',
        currency: 'ETH',
        description: '',
        github: '',
        model: 'GPT-4o'
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const currencies = [
        { code: 'ETH', name: 'Ethereum' },
        { code: 'SOL', name: 'Solana' },
        { code: 'USDC', name: 'USDC' },
        { code: 'BTC', name: 'Bitcoin (wBTC)' },
        { code: 'STORY', name: 'Story' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) return;

        setSubmitting(true);
        const success = await addAgent(formData, file);
        setSubmitting(false);

        if (success) {
            navigate('/explore');
        } else {
            alert('The collective encountered an error. Please try again.');
        }
    };

    if (!isConnected) {
        return (
            <div className="container animate-fade-in-up" style={{ padding: '200px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '40px', opacity: 0.1 }}>
                    <AlertCircle size={100} style={{ margin: '0 auto' }} />
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Connection Required</h2>
                <p style={{ color: '#666', marginBottom: '40px' }}>You must be part of the collective to contribute your craft.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Connect Wallet</button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px', maxWidth: '900px' }}>

            <div style={{ marginBottom: '80px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    <Terminal size={14} />
                    <span>CONTRIBUTE TO THE CRAFT</span>
                </div>
                <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.05em' }}>Deploy your legacy.</h1>
                <p style={{ color: '#666', maxWidth: '540px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                    List your agent with your preferred currency. The collective supports multiple networks for direct distribution.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '60px', alignItems: 'start' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                AGENT NAME
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nexus Explorer"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', padding: '12px 0', color: '#fff', fontSize: '18px', fontWeight: '700', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                CATEGORY
                            </label>
                            <input
                                type="text"
                                name="role"
                                placeholder="Data Analysis"
                                required
                                value={formData.role}
                                onChange={handleChange}
                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', padding: '12px 0', color: '#fff', fontSize: '18px', fontWeight: '700', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                BUILDER PRICE
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 16px' }}>
                                <DollarSign size={16} color="#444" style={{ marginRight: '12px' }} />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0.5"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 0', color: '#fff', fontSize: '15px', fontWeight: '700', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                CURRENCY
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 16px' }}>
                                <Coins size={16} color="#444" style={{ marginRight: '12px' }} />
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 0', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                                >
                                    {currencies.map(c => (
                                        <option key={c.code} value={c.code} style={{ background: '#0a0a0a', color: '#fff' }}>{c.name} ({c.code})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                GITHUB REPOSITORY LINK
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 16px' }}>
                                <Github size={16} color="#444" style={{ marginRight: '12px' }} />
                                <input
                                    type="url"
                                    name="github"
                                    placeholder="https://github.com/yourname/repo"
                                    required
                                    value={formData.github}
                                    onChange={handleChange}
                                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 0', color: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                                BASE ENGINE
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0 16px' }}>
                                <Cpu size={16} color="#444" style={{ marginRight: '12px' }} />
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 0', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="GPT-4o" style={{ background: '#0a0a0a', color: '#fff' }}>GPT-4o</option>
                                    <option value="Claude 3.5 Sonnet" style={{ background: '#0a0a0a', color: '#fff' }}>Claude 3.5</option>
                                    <option value="Llama 3 (70B)" style={{ background: '#0a0a0a', color: '#fff' }}>Llama 3</option>
                                    <option value="Custom Engine" style={{ background: '#0a0a0a', color: '#fff' }}>Custom</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#444', marginBottom: '16px' }}>
                            BRIEF NARRATIVE
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="What problem does this solve?"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', color: '#fff', fontSize: '14px', lineHeight: '1.6', outline: 'none', resize: 'none' }}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '64px', fontSize: '16px', borderRadius: '16px' }} disabled={submitting}>
                        {submitting ? 'RECORDING ON LEDGER...' : 'CONFIRM DEPLOYMENT'}
                    </button>
                </div>

                <div style={{ position: 'sticky', top: '120px' }}>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#333', marginBottom: '20px' }}>
                            AVATAR (1:1)
                        </label>
                        <div style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            background: '#0a0a0a',
                            borderRadius: '16px',
                            border: '1px dashed var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative'
                        }} className="hover-lift">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 1 }}
                            />
                            {preview ? (
                                <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Upload size={20} color="#222" />
                            )}
                        </div>

                        {formData.github && (
                            <div className="animate-fade-in" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Github size={14} color="#fff" />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#555', textTransform: 'uppercase' }}>Connected Repo</div>
                                    <div style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formData.github.split('/').pop()}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', fontSize: '11px', color: '#444', lineHeight: '1.5', display: 'flex', gap: '10px' }}>
                            <Info size={14} style={{ flexShrink: 0 }} />
                            <span>This avatar will represent your agent's identity across the entire registry.</span>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default SellAgent;
