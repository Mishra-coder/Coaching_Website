import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Rahul Sharma',
            exam: 'SSC CGL 2023',
            rank: 'AIR 45',
            quote: "Success Mantra's structured approach and regular mock tests were the key to my success. The faculty is incredibly supportive.",
            image: '/images/testimonials/student1.png'
        },
        {
            name: 'Priya Patel',
            exam: 'IBPS PO',
            rank: 'Selected',
            quote: "I was weak in Maths, but Vikas Sir's unique teaching style made it my strongest subject. Highly recommended!",
            image: '/images/testimonials/student2.png'
        },
        {
            name: 'Amit Kumar',
            exam: 'NDA',
            rank: 'Recommended',
            quote: "The discipline and competitive environment at Success Mantra helped me crack NDA in my first attempt.",
            image: '/images/testimonials/student3.png'
        },
        {
            name: 'Anjali Gupta',
            exam: 'UPPCS',
            rank: 'Deputy Collector',
            quote: "The personalized mentorship and detail-oriented study material at Success Mantra is truly world-class.",
            image: '/images/testimonials/student4.png'
        }
    ];

    return (
        <section className="testimonials-section" style={{ padding: '100px 0', background: '#ffffff' }}>
            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
                <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px', marginBottom: '15px' }}>
                        Student <span style={{ color: '#1a237e' }}>Success</span> Stories
                    </h2>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', fontWeight: '500' }}>
                        Transforming dreams into high-achieving careers with personalized guidance and rigorous training.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {testimonials.map((t, index) => (
                        <div key={index} style={{
                            background: '#f8fafc',
                            padding: '45px 35px',
                            borderRadius: '32px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                            height: '100%',
                            position: 'relative',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                            className="testimonial-card"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.12)';
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.borderColor = '#1a237e30';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)';
                                e.currentTarget.style.background = '#f8fafc';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={{ marginBottom: '30px', position: 'relative', width: '90px' }}>
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '24px',
                                        objectFit: 'cover',
                                        border: '5px solid #fff',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-8px',
                                    right: '-8px',
                                    background: '#1a237e',
                                    color: '#fff',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                    border: '4px solid #f8fafc',
                                    zIndex: 2,
                                    boxShadow: '0 4px 10px rgba(26, 35, 126, 0.3)'
                                }}>
                                    <i className="fas fa-check"></i>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '850', color: '#1e293b' }}>{t.name}</h4>
                                <div style={{ marginBottom: '25px' }}>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                        color: '#166534',
                                        padding: '6px 16px',
                                        borderRadius: '50px',
                                        fontSize: '0.8rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px',
                                        display: 'inline-block'
                                    }}>
                                        {t.exam} • {t.rank}
                                    </span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <i className="fas fa-quote-left" style={{
                                        color: '#1a237e',
                                        opacity: 0.08,
                                        position: 'absolute',
                                        top: '-25px',
                                        left: '-20px',
                                        fontSize: '4rem'
                                    }}></i>
                                    <p style={{
                                        color: '#475569',
                                        lineHeight: '1.8',
                                        fontSize: '1.05rem',
                                        fontStyle: 'italic',
                                        fontWeight: '500',
                                        margin: 0,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        "{t.quote}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;