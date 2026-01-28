import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const metrics = [
        { value: '1000+', title: 'Students Mentored' },
        { value: '98%', title: 'Success Rate' },
        { value: '15+', title: 'Years Experience' }
    ];

    const highlights = [
        { icon: 'fa-check-circle', label: 'Personalized Attention', styleClass: 'card-1' },
        { icon: 'fa-trophy', label: 'Top Rankers', styleClass: 'card-2' }
    ];

    return (
        <section id="home" className="hero">
            <div className="hero-shape-1"></div>
            <div className="hero-shape-2"></div>

            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-badge">Admissions Open 2025-26</span>

                    <h1 className="hero-title">
                        Unlock Your True <br />
                        <span className="text-gradient">Academic Potential</span>
                    </h1>

                    <p className="hero-description">
                        Premier offline coaching for <strong>Class 1st to 12th</strong>.
                        Experience the power of in-person learning with expert mentorship
                        under <strong>Mr. Vikas Sir</strong> & <strong>Mr. Himanshu Sir</strong>.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/enroll" className="btn-primary">
                            Book a Free Demo <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                        <Link to="/courses" className="btn-secondary">
                            Explore Courses
                        </Link>
                    </div>

                    <div className="hero-stats">
                        {metrics.map((item, index) => (
                            <div key={index} className="hero-stat-item">
                                <h3>{item.value}</h3>
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <img
                        src="/hero_student.png"
                        alt="Student studying at Success Mantra"
                        className="hero-main-img"
                    />
                    {highlights.map((item, index) => (
                        <div key={index} className={`floating-card ${item.styleClass}`}>
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;