import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import AgentAvatar from './AgentAvatar';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
    const { username, account } = useWallet();

    // Check if the current user is the owner (mocked logic)
    const isOwner = agent.owner === account || agent.owner === username;
    const ownerName = isOwner && username ? `@${username}` : (agent.owner ? `@${agent.owner.slice(0, 8)}` : '@builder');

    // Random mock of community support
    const supports = React.useMemo(() => Math.floor(Math.random() * 80) + 12, []);

    return (
        <Link to={`/agent/${agent.id}`} className="agent-card-opensea">
            <div className="card-image-wrapper">
                <AgentAvatar image={agent.image} name={agent.name} size="100%" />
                <div className="card-overlay">
                    <span className="overlay-badge">Verified by Community</span>
                </div>
            </div>

            <div className="card-info">
                <div className="info-main">
                    <h3 className="agent-name">{agent.name}</h3>
                    <div className="builder-name">Crafted by {ownerName}</div>
                </div>

                <div className="info-community" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555', margin: '4px 0' }}>
                    <Heart size={12} fill="rgba(255,255,255,0.1)" />
                    <span>Trusted by {supports} humans</span>
                </div>

                <div className="info-footer">
                    <div className="price-section">
                        <span className="price-label">Builder Price</span>
                        <div className="price-value">{agent.price} {agent.currency || 'ETH'}</div>
                    </div>
                    <div className="role-tag">{agent.role}</div>
                </div>
            </div>
        </Link>
    );
};

export default AgentCard;
