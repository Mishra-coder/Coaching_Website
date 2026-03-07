import React from 'react';
import supriya from '../assets/testimonials/supriyaAg.png';
import anujKumar from '../assets/testimonials/anuj.png';
import laxmi from '../assets/testimonials/Laxmi.png';
import vinayak from '../assets/testimonials/Vinayak.png';

const Testimonials = () => {
  const stories = [
    {
      user: 'Supriya Agrahari',
      target: 'Class 12th 2024',
      achievement: '85%',
      feedback:
        'The teachers at Success Mantra are amazing! They made difficult subjects easy to understand and helped me score excellent marks in my board exams.',
      avatar: supriya,
    },
    {
      user: 'Anuj Kumar',
      target: 'Class 12th 2023',
      achievement: '85%',
      feedback:
        'Vikas Sir made Maths so simple and easy. His teaching helped me score 85% in Class 12th. Thank you Success Mantra!',
      avatar: anujKumar,
    },
    {
      user: 'Laxmi Agrahari',
      target: 'Class 10th 2024',
      achievement: '89%',
      feedback:
        'I was weak in Science, but the teachers here made it my strongest subject. The regular tests and doubt sessions really helped me improve.',
      avatar: laxmi,
    },
    {
      user: 'Vinayak Agrahari',
      target: 'Class 10th 2024',
      achievement: '84%',
      feedback:
        'The supportive environment and excellent teaching methods at Success Mantra helped me achieve great results in my board exams.',
      avatar: vinayak,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">
            Student <span className="highlight">Success</span> Stories
          </h2>
          <p className="testimonials-subtitle">
            Transforming dreams into high-achieving careers with personalized
            guidance and rigorous training.
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
                  <p className="testimonial-text">"{item.feedback}"</p>
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
