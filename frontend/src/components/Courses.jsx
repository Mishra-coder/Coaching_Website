import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
    const competitiveCategories = [
        {
            name: 'Govt Job Exams',
            skills: ['SSC', 'Banking', 'Teaching', 'Judiciary'],
            icon: 'fa-landmark',
            theme: '#e3f2fd',
            accent: '#1a237e'
        },
        {
            name: 'Defence',
            skills: ['NDA', 'CDS', 'AFCAT', 'Agniveer'],
            icon: 'fa-shield-alt',
            theme: '#e0f2f1',
            accent: '#00695c'
        },
        {
            name: 'UPSC',
            skills: ['Civil Services'],
            icon: 'fa-users',
            theme: '#fff3e0',
            accent: '#ef6c00'
        }
    ];

    const schoolWings = [
        {
            name: 'Junior Wing',
            classes: 'Class 1st - 5th',
            points: ['Strong Basics', 'Activity Based Learning'],
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            highlight: false
        },
        {
            name: 'Middle Wing',
            classes: 'Class 6th - 8th',
            points: ['Concept Building', 'Olympiad Prep'],
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            highlight: false
        },
        {
            name: 'Senior Wing',
            classes: 'Class 9th - 12th',
            points: ['Board Exam Excellence', 'PCM / PCB / Commerce'],
            gradient: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
            highlight: true
        }
    ];

    const onHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.12)';
    };

    const onLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
    };

    return (
        <section id="programs" className="programs" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div className="section-header">
                    <h2>Our <span className="highlight">Courses</span></h2>
                    <p>Comprehensive coaching for School and Competitive Exams.</p>
                </div>

                <h3 className="section-subtitle-text">Competitive Exams</h3>

                <div className="program-grid" style={{ marginBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                    {competitiveCategories.map((item) => (
                        <Link key={item.name} to="/enroll" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="category-card"
                                style={{
                                    background: '#fff',
                                    borderRadius: '24px',
                                    padding: '25px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '280px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                onMouseEnter={onHover}
                                onMouseLeave={onLeave}
                            >
                                <div style={{ zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#000', marginBottom: '15px' }}>{item.name}</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '65%' }}>
                                        {item.skills.map((skill, i) => (
                                            <span key={i} style={{ padding: '6px 16px', borderRadius: '50px', border: '1px solid #e0e0e0', color: '#444', fontSize: '0.85rem', fontWeight: '600', background: '#fff' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', zIndex: 1 }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1a237e', marginRight: '12px' }}>Enroll Now</span>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
                                        <i className="fas fa-arrow-right" style={{ color: '#333', fontSize: '0.9rem' }}></i>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', width: '180px', height: '180px', background: item.theme, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0.6', zIndex: '0' }}>
                                    <i className={`fas ${item.icon}`} style={{ fontSize: '5rem', color: item.accent, transform: 'translate(-10px, -10px)' }} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <h3 className="section-subtitle-text">School Classes</h3>

                <div className="program-grid">
                    {schoolWings.map((wing) => (
                        <Link key={wing.name} to="/enroll" className={`program-card ${wing.highlight ? 'featured' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {wing.highlight && <div className="popular-tag">Board Focus</div>}
                            <div className="card-header" style={{ background: wing.gradient, color: '#fff', padding: '30px' }}>
                                <h3>{wing.name}</h3>
                                <span className="grade">{wing.classes}</span>
                            </div>
                            <div className="card-body">
                                <ul>
                                    {wing.points.map((pt, i) => (
                                        <li key={i}><i className="fas fa-check" /> {pt}</li>
                                    ))}
                                </ul>
                                <span className="enroll-btn-simple">Enroll Now</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;