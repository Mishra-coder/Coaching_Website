import React, { useEffect, useRef } from 'react';

const About = () => {
    const listContainerRef = useRef(null);

    const featureHighlights = [
        {
            icon: 'fa-chalkboard-teacher',
            title: 'Expert Faculty',
            text: 'Learn from the best minds with years of experience in shaping toppers.',
            delay: '0s'
        },
        {
            icon: 'fa-users',
            title: 'Small Batch Size',
            text: 'Limited students per batch to ensure individual attention and doubt clearing.',
            delay: '0.1s'
        },
        {
            icon: 'fa-book-reader',
            title: 'Comprehensive Material',
            text: 'Curated study material designed to cover school curriculum and competitive exams.',
            delay: '0.2s'
        },
        {
            icon: 'fa-chart-line',
            title: 'Regular Testing',
            text: 'Weekly tests and performance analysis to track progress and identify weak areas.',
            delay: '0.3s'
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = listContainerRef.current.querySelectorAll('.feature-card');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="about-page" ref={listContainerRef}>
            <div className="container">
                <div className="section-header text-center">
                    <h2>
                        About <span style={{ color: '#1a237e' }}>Success</span> <span className="highlight">Mantra</span>
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto' }}>
                        We bridge the gap between potential and performance through our structured offline methodology.
                        Our mission is to empower students with knowledge and confidence.
                    </p>
                </div>

                <div className="feature-grid">
                    {featureHighlights.map((item, index) => (
                        <div
                            key={index}
                            className="feature-card scroll-hidden"
                            style={{ transitionDelay: item.delay }}
                        >
                            <div className="icon-box">
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>

                <div className="row vision-mission-row">
                    <div className="col-md-6 mb-4">
                        <div className="vision-card">
                            <h3 className="vision-title">Our Vision</h3>
                            <p className="card-text">
                                To be the leading institute in providing quality education that is accessible and affordable.
                                We aim to create a learning environment that fosters critical thinking and holistic development.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="mission-card">
                            <h3 className="mission-title">Our Mission</h3>
                            <p className="card-text">
                                To guide students towards academic excellence through personalized mentoring and innovative teaching methods.
                                We are committed to helping every student realize their full potential.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;