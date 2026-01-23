import React, { useState } from 'react';

const FAQ = () => {
    const [selectedId, setSelectedId] = useState(null);

    const questionsList = [
        {
            title: "How can I enroll in a course?",
            content: "You can enroll by visiting our center directly or by filling out the online admission form on our website. Click on 'Enroll Now' to get started."
        },
        {
            title: "Do you provide study material?",
            content: "Yes, we provide comprehensive printed study material, including theory notes, practice questions, and previous year papers, all included in the course fee."
        },
        {
            title: "Is there a demo class available?",
            content: "Absolutely! We offer 3 days of free demo classes so you can experience our teaching methodology before making a decision."
        },
        {
            title: "What is the batch size?",
            content: "We maintain a small batch size of 30-40 students to ensure personal attention and effective doubt clearing for every student."
        }
    ];

    const toggleAccordion = (id) => {
        setSelectedId(selectedId === id ? null : id);
    };

    return (
        <section className="faq-section" style={{ padding: '80px 0', background: '#fff' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center mb-5">
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
                                Frequently Asked <span style={{ color: '#1a237e' }}>Questions</span>
                            </h2>
                        </div>

                        <div className="accordion-list">
                            {questionsList.map((item, index) => (
                                <div key={index} style={{
                                    marginBottom: '20px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: selectedId === index ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease',
                                    background: '#fff'
                                }}>
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        style={{
                                            width: '100%',
                                            padding: '25px',
                                            background: '#fff',
                                            border: 'none',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{
                                            fontWeight: '700',
                                            fontSize: '1.1rem',
                                            color: selectedId === index ? '#4f46e5' : '#1e293b'
                                        }}>
                                            {item.title}
                                        </span>
                                        <i className={`fas fa-chevron-down`} style={{
                                            transform: selectedId === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                            color: '#64748b'
                                        }}></i>
                                    </button>

                                    <div style={{
                                        maxHeight: selectedId === index ? '200px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.3s ease-out',
                                        background: '#fff'
                                    }}>
                                        <div style={{ padding: '0 20px 20px', color: '#64748b', lineHeight: '1.6' }}>
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;