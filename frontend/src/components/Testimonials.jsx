import React from 'react';
import student1 from '../assets/testimonials/student1.png';
import student2 from '../assets/testimonials/student2.png';
import student3 from '../assets/testimonials/student3.png';
import student4 from '../assets/testimonials/student4.png';

const Testimonials = () => {
    const stories = [
        {
            user: 'Rahul Sharma',
            target: 'SSC CGL 2023',
            achievement: 'AIR 45',
            feedback: "Success Mantra's structured approach and regular mock tests were the key to my success. The faculty is incredibly supportive.",
            avatar: student1
        },
        {
            user: 'Priya Patel',
            target: 'IBPS PO',
            achievement: 'Selected',
            feedback: "I was weak in Maths, but Vikas Sir's unique teaching style made it my strongest subject. Highly recommended!",
            avatar: student2
        },
        {
            user: 'Amit Kumar',
            target: 'NDA',
            achievement: 'Recommended',
            feedback: "The discipline and competitive environment at Success Mantra helped me crack NDA in my first attempt.",
            avatar: student3
        },
        {
            user: 'Anjali Gupta',
            target: 'UPPCS',
            achievement: 'Deputy Collector',
            feedback: "The personalized mentorship and detail-oriented study material at Success Mantra is truly world-class.",
            avatar: student4
        }
    ];

    return (
        <section className="testimonials-section">
            <div className="container">
                <div className="testimonials-header">
                    <h2 className="testimonials-title">
                        Student <span className="highlight">Success</span> Stories
                    </h2>
                    <p className="testimonials-subtitle">
                        Transforming dreams into high-achieving careers with personalized guidance and rigorous training.
                    </p>
                </div>

                <div className="testimonials-grid">
                    {stories.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-avatar-wrapper">
                                <img
                                    src={item.avatar}
                                    alt={item.user}
                                    className="testimonial-avatar"
                                />
                                <div className="verified-badge">
                                    <i className="fas fa-check"></i>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 className="testimonial-user">{item.user}</h4>
                                <div style={{ marginBottom: '25px' }}>
                                    <span className="achievement-badge">
                                        {item.target} • {item.achievement}
                                    </span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <i className="fas fa-quote-left quote-icon"></i>
                                    <p className="testimonial-text">
                                        "{item.feedback}"
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