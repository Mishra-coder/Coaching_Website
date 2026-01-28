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
            <div className="container hero-container">
                <div className="hero-content fade-in-up">
                    <span className="badge">Admissions Open 2025-26</span>

                    <h1>
                        Unlock Your True <br />
                        <span className="text-gradient">Academic Potential</span>
                    </h1>

                    <p>
                        Premier offline coaching for <span className="highlight">Class 1st to 12th</span>.
                        Experience the power of in-person learning with expert mentorship
                        under <span className="highlight">Mr. Vikas Sir</span> & <span className="highlight">Mr. Himanshu Sir</span>.
                    </p>

                    <div className="hero-btns">
                        <Link to="/demo" className="btn-primary">
                            Book a Free Demo <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                        </Link>
                        <Link to="/courses" className="btn-secondary">
                            Explore Courses
                        </Link>
                    </div>

                    <div className="stats">
                        {metrics.map((item, index) => (
                            <div className="stat-item" key={index}>
                                <h3>{item.value}</h3>
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-image fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="image-wrapper">
                        <img src="/hero_student.png" alt="Student studying" />

                        {highlights.map((item, index) => (
                            <div className={`floating-card ${item.styleClass}`} key={index}>
                                <i className={`fas ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;