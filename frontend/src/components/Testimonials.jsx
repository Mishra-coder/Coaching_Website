import React from 'react';
const Testimonials = () => {
    const testimonials = [
        {
            name: 'Rahul Sharma',
            exam: 'SSC CGL 2023',
            rank: 'AIR 45',
            quote: "Success Mantra's structured approach and regular mock tests were the key to my success. The faculty is incredibly supportive.",
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Priya Patel',
            exam: 'IBPS PO',
            rank: 'Selected',
            quote: "I was weak in Maths, but Vikas Sir's unique teaching style made it my strongest subject. Highly recommended!",
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Amit Kumar',
            exam: 'NDA',
            rank: 'Recommended',
            quote: "The discipline and competitive environment at Success Mantra helped me crack NDA in my first attempt.",
            image: 'https://randomuser.me/api/portraits/men/86.jpg'
        }
    ];
    return (
        <section className="testimonials-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
                        Student <span style={{ color: '#1a237e' }}>Success</span> Stories
                    </h2>
                    <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                        Hear from our students who have transformed their dreams into reality.
                    </p>
                </div>
                <div className="row g-4">
                    {testimonials.map((t, index) => (
                        <div key={index} className="col-md-4">
                            <div style={{
                                background: '#fff',
                                padding: '40px 30px',
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                height: '100%',
                                position: 'relative',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                                }}
                            >
                                <i className="fas fa-quote-right" style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: '30px',
                                    fontSize: '3rem',
                                    color: '#f1f5f9',
                                    zIndex: 0
                                }}></i>
                                <div className="d-flex align-items-center mb-4">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginRight: '15px',
                                            border: '3px solid #e2e8f0'
                                        }}
                                    />
                                    <div>
                                        <h5 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{t.name}</h5>
                                        <span className="badge" style={{
                                            background: '#dcfce7',
                                            color: '#166534',
                                            marginTop: '5px',
                                            fontWeight: '600'
                                        }}>
                                            {t.exam} • {t.rank}
                                        </span>
                                    </div>
                                </div>
                                <p style={{ color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>
                                    "{t.quote}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Testimonials;