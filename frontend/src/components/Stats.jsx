import React from 'react';
const Stats = () => {
    const stats = [
        { number: '5000+', label: 'Students Enrolled', icon: 'fa-user-graduate', color: '#3b82f6' },
        { number: '1200+', label: 'Govt Selections', icon: 'fa-award', color: '#f59e0b' },
        { number: '15+', label: 'Years of Excellence', icon: 'fa-calendar-check', color: '#10b981' },
        { number: '50+', label: 'Expert Faculty', icon: 'fa-chalkboard-teacher', color: '#8b5cf6' }
    ];
    return (
        <section className="stats-section" style={{ padding: '60px 0', background: '#fff' }}>
            <div className="container">
                <div className="row g-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-md-3 col-6">
                            <div style={{
                                textAlign: 'center',
                                padding: '30px 20px',
                                borderRadius: '24px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                height: '100%'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: `${stat.color}20`,
                                    color: stat.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    margin: '0 auto 15px'
                                }}>
                                    <i className={`fas ${stat.icon}`}></i>
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
                                    {stat.number}
                                </h2>
                                <p style={{ color: '#64748b', fontWeight: '600', margin: 0 }}>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Stats;