import React from 'react';

// ============================================
// HERO COMPONENT
// Landing page hero section with CTA
// ============================================

const Hero = () => {
    // ========== STATISTICS DATA ==========
    const stats = [
        { number: '1000+', label: 'Students Mentored' },
        { number: '98%', label: 'Success Rate' },
        { number: '15+', label: 'Years Experience' }
    ];

    // ========== FLOATING CARDS DATA ==========
    const floatingCards = [
        { icon: 'fa-check-circle', text: 'Personalized Attention', className: 'card-1' },
        { icon: 'fa-trophy', text: 'Top Rankers', className: 'card-2' }
    ];

    // ========== MAIN RENDER ==========
    return (
        <section id="home" className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }}></div>

            <div className="container hero-container" style={{ position: 'relative', zIndex: 1 }}>

                {/* ========== LEFT SIDE: HERO CONTENT ========== */}
                <div className="hero-content">
                    {/* Badge */}
                    <span className="badge fade-in-up" style={{ animationDelay: '0.1s' }}>Admissions Open 2025-26</span>

                    {/* Main Heading */}
                    <h1 className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Unlock Your True <br />
                        <span className="text-gradient">Academic Potential</span>
                    </h1>

                    {/* Description */}
                    <p className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Premier offline coaching for <strong>Class 1st to 12th</strong>.
                        Experience the power of in-person learning with expert mentorship
                        under <strong>Mr. Vikas Sir</strong> & <strong>Mr. Himanshu Sir</strong>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-btns fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <a href="#contact" className="btn-primary">
                            Book a Free Demo <i className="fas fa-arrow-right ms-2"></i>
                        </a>
                        <a href="#programs" className="btn-secondary">
                            Explore Courses
                        </a>
                    </div>

                    {/* Statistics */}
                    <div className="stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <h3>{stat.number}</h3>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========== RIGHT SIDE: HERO IMAGE ========== */}
                <div className="hero-image">
                    <div className="image-wrapper">
                        {/* Main Image */}
                        <img
                            src="/hero_student.png"
                            alt="Student studying"
                            id="hero-img"
                        />

                        {/* Floating Cards */}
                        {floatingCards.map((card, index) => (
                            <div key={index} className={`floating-card ${card.className}`}>
                                <i className={`fas ${card.icon}`}></i>
                                <span>{card.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
