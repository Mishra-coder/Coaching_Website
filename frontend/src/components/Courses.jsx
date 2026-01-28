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
            gradientSpec: 'foundation',
            highlight: false
        },
        {
            name: 'Middle Wing',
            classes: 'Class 6th - 8th',
            points: ['Concept Building', 'Olympiad Prep'],
            gradientSpec: 'competitive',
            highlight: false
        },
        {
            name: 'Senior Wing',
            classes: 'Class 9th - 12th',
            points: ['Board Exam Excellence', 'PCM / PCB / Commerce'],
            gradientSpec: 'board',
            highlight: true
        }
    ];

    return (
        <section id="programs" className="programs-page">
            <div className="container">
                <div className="section-header">
                    <h2>Our <span className="highlight">Courses</span></h2>
                    <p>Comprehensive coaching for School and Competitive Exams.</p>
                </div>

                <h3 className="section-subtitle-text">Competitive Exams</h3>

                <div className="program-grid" style={{ marginBottom: '60px' }}>
                    {competitiveCategories.map((item) => (
                        <Link key={item.name} to="/enroll" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="category-card">
                                <div className="category-content">
                                    <h3 className="category-title">{item.name}</h3>
                                    <div className="skill-tags">
                                        {item.skills.map((skill, i) => (
                                            <span key={i} className="skill-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="enroll-action">
                                    <span className="enroll-text">Enroll Now</span>
                                    <div className="enroll-icon">
                                        <i className="fas fa-arrow-right enroll-arrow"></i>
                                    </div>
                                </div>

                                <div className="category-bg-icon" style={{ background: item.theme }}>
                                    <i className={`fas ${item.icon} bg-icon-large`} style={{ color: item.accent }} />
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

                            <div className={`card-header ${wing.gradientSpec}`}>
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