import React from 'react';

const Stats = () => {
    const achievementList = [
        { count: '1000+', name: 'Students Enrolled', icon: 'fa-user-graduate', theme: '#3b82f6' },
        { count: '100+', name: 'Govt Selections', icon: 'fa-award', theme: '#f59e0b' },
        { count: '10+', name: 'Years of Excellence', icon: 'fa-calendar-check', theme: '#10b981' },
        { count: '50+', name: 'Expert Faculty', icon: 'fa-chalkboard-teacher', theme: '#8b5cf6' }
    ];

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {achievementList.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div
                                className="stat-icon-box"
                                style={{ background: `${stat.theme}15`, color: stat.theme }}
                            >
                                <i className={`fas ${stat.icon}`}></i>
                            </div>
                            <h2 className="stat-number">{stat.count}</h2>
                            <p className="stat-label">{stat.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;