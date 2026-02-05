import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await leaderboardAPI.getLeaderboard();
                setLeaderboard(data.leaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="loader"></div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <section className="leaderboard-section">
            <div className="container">
                <div className="leaderboard-header text-center">
                    <h1 className="leaderboard-title">Leaderboard</h1>
                    <p className="leaderboard-subtitle">Top achievers of Success Mantra</p>
                </div>

                {leaderboard.length === 0 ? (
                    <div className="text-center" style={{ padding: '50px' }}>
                        <h3>No data yet. Be the first to take a quiz!</h3>
                    </div>
                ) : (
                    <>
                        <div className="podium-container">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div className="podium-item second">
                                    <div className="podium-rank">2</div>
                                    <div className="podium-avatar">
                                        <img src={topThree[1].avatar || "https://ui-avatars.com/api/?name=" + topThree[1].name} alt={topThree[1].name} />
                                    </div>
                                    <h3 className="podium-name">{topThree[1].name}</h3>
                                    <div className="podium-xp">{topThree[1].totalXP} XP</div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {topThree[0] && (
                                <div className="podium-item first">
                                    <div className="podium-crown">👑</div>
                                    <div className="podium-rank">1</div>
                                    <div className="podium-avatar">
                                        <img src={topThree[0].avatar || "https://ui-avatars.com/api/?name=" + topThree[0].name} alt={topThree[0].name} />
                                    </div>
                                    <h3 className="podium-name">{topThree[0].name}</h3>
                                    <div className="podium-xp">{topThree[0].totalXP} XP</div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <div className="podium-item third">
                                    <div className="podium-rank">3</div>
                                    <div className="podium-avatar">
                                        <img src={topThree[2].avatar || "https://ui-avatars.com/api/?name=" + topThree[2].name} alt={topThree[2].name} />
                                    </div>
                                    <h3 className="podium-name">{topThree[2].name}</h3>
                                    <div className="podium-xp">{topThree[2].totalXP} XP</div>
                                </div>
                            )}
                        </div>

                        <div className="leaderboard-list">
                            <div className="list-header">
                                <span>Rank</span>
                                <span>Name</span>
                                <span style={{ textAlign: 'right' }}>XP</span>
                            </div>
                            {rest.map((user, index) => (
                                <div className="list-item" key={user._id}>
                                    <div className="list-rank">{index + 4}</div>
                                    <div className="list-user">
                                        <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} alt={user.name} className="list-avatar" />
                                        <span className="list-name">{user.name}</span>
                                    </div>
                                    <div className="list-xp">{user.totalXP} XP</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
