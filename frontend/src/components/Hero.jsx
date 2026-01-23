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
        <section id="home" className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div className="container hero-container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="hero-content">
                    <span className="badge fade-in-up" style={{ animationDelay: '0.1s' }}>Admissions Open 2025-26</span>

                    <h1 className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Unlock Your True <br />
                        <span className="text-gradient">Academic Potential</span>
                    </h1>

                    <p className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Premier offline coaching for <strong>Class 1st to 12th</strong>.
                        Experience the power of in-person learning with expert mentorship
                        under <strong>Mr. Vikas Sir</strong> & <strong>Mr. Himanshu Sir</strong>.
                    </p>

                    <div className="hero-btns fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <Link to="/enroll" className="btn-primary">
                            Book a Free Demo <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                        <Link to="/courses" className="btn-secondary">
                            Explore Courses
                        </Link>
                    </div>

                    <div className="stats">
                        {metrics.map((item, index) => (
                            <div key={index} className="stat-item">
                                <h3>{item.value}</h3>
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-image">
                    <div className="image-wrapper">
                        <img
                            src="/hero_student.png"
                            alt="Student studying at Success Mantra"
                            id="hero-img"
                        />
                        {highlights.map((item, index) => (
                            <div key={index} className={`floating-card ${item.styleClass}`}>
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