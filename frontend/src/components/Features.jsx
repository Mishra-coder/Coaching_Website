import React, { useEffect, useRef } from 'react';
const Features = () => {
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
        <section id="about" className="features" ref={featuresRef}>
            <div className="container">
                { }
                <div className="section-header">
                    <h2>
                        Why Choose{' '}
                        <span style={{ color: '#1a237e' }}>Success</span>{' '}
                        <span className="highlight">मंत्रा?</span>
                    </h2>
                    <p>
                        We bridge the gap between potential and performance through
                        our structured offline methodology.
                    </p>
                </div>
                { }
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
                            { }
                            <div className="icon-box">
                                <i className={`fas ${feature.icon}`}></i>
                            </div>
                            { }
                            <h3>{feature.title}</h3>
                            { }
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Features;