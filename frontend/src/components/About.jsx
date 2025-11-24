import React, { useEffect, useRef } from 'react';
const About = () => {
    const featuresRef = useRef(null);
    const features = [
        {
            icon: 'fa-chalkboard-teacher',
            title: 'Expert Faculty',
            description: 'Learn from the best minds with years of experience in shaping toppers.',
            delay: '0s'
        },
        {
            icon: 'fa-users',
            title: 'Small Batch Size',
            description: 'Limited students per batch to ensure individual attention and doubt clearing.',
            delay: '0.1s'
        },
        {
            icon: 'fa-book-reader',
            title: 'Comprehensive Material',
            description: 'Curated study material designed to cover school curriculum and competitive exams.',
            delay: '0.2s'
        },
        {
            icon: 'fa-chart-line',
            title: 'Regular Testing',
            description: 'Weekly tests and performance analysis to track progress and identify weak areas.',
            delay: '0.3s'
        }
    ];
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1 }
        );
        const cards = featuresRef.current.querySelectorAll('.feature-card');
        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, []);
    return (
        <section className="about-page" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh' }} ref={featuresRef}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                    <h2>
                        About <span style={{ color: '#1a237e' }}>Success</span> <span className="highlight">Mantra</span>
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto' }}>
                        We bridge the gap between potential and performance through our structured offline methodology.
                        Our mission is to empower students with knowledge and confidence.
                    </p>
                </div>
                <div className="feature-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{
                                opacity: 0,
                                transform: 'translateY(20px)',
                                transition: 'all 0.5s ease',
                                transitionDelay: feature.delay
                            }}
                        >
                            <div className="icon-box">
                                <i className={`fas ${feature.icon}`}></i>
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
                <div className="row mt-5 align-items-center">
                    <div className="col-md-6">
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
                            <h3 style={{ color: '#1a237e', marginBottom: '20px' }}>Our Vision</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                                To be the leading institute in providing quality education that is accessible and affordable.
                                We aim to create a learning environment that fosters critical thinking and holistic development.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div style={{ padding: '20px', background: '#fff7ed', borderRadius: '20px' }}>
                            <h3 style={{ color: '#9a3412', marginBottom: '20px' }}>Our Mission</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.8' }}>
                                To guide students towards academic excellence through personalized mentoring and innovative teaching methods.
                                We are committed to helping every student realize their full potential.
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};
export default About;