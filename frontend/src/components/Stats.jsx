import React from 'react';
const Stats = () => {
    const stats = [
        { number: '5000+', label: 'Students Enrolled', icon: 'fa-user-graduate', color: '#3b82f6' },
        { number: '1200+', label: 'Govt Selections', icon: 'fa-award', color: '#f59e0b' },
        { number: '15+', label: 'Years of Excellence', icon: 'fa-calendar-check', color: '#10b981' },
        { number: '50+', label: 'Expert Faculty', icon: 'fa-chalkboard-teacher', color: '#8b5cf6' }
    ];
    return (
        <section className="stats-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '30px'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            textAlign: 'center',
                            padding: '45px 30px',
                            borderRadius: '30px',
                            background: '#fff',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            className="stat-card"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-12px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = `${stat.color}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '22px',
                                background: `${stat.color}15`,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                marginBottom: '25px',
                                transition: 'all 0.3s ease'
                            }}>
                                <i className={`fas ${stat.icon}`}></i>
                            </div>
                            <h2 style={{
                                fontSize: '2.8rem',
                                fontWeight: '850',
                                color: '#1e293b',
                                marginBottom: '8px',
                                letterSpacing: '-1px'
                            }}>
                                {stat.number}
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontWeight: '700',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Stats;