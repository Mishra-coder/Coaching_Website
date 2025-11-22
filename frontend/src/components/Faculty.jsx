import React from 'react';
import vikasSirImg from '../assets/vikas_sir.png';
import himanshuSirImg from '../assets/himanshu_sir.png';
import sureshGuptaImg from '../assets/suresh_gupta.png';
import priyaSinghImg from '../assets/priya_singh.png';
import amitPatelImg from '../assets/amit_patel.png';
import nehaAgarwalImg from '../assets/neha_agarwal.png';

const Faculty = () => {
    const facultyData = [
        {
            id: 1,
            name: "Mr. Vikas Sir",
            subject: "Mathematics",
            qualification: "M.Sc. Mathematics, B.Ed (15+ Years Experience)",
            image: vikasSirImg
        },
        {
            id: 2,
            name: "Mr. Himanshu Sir",
            subject: "Physics",
            qualification: "M.Sc. Physics, Gold Medalist (10+ Years Experience)",
            image: himanshuSirImg
        },
        {
            id: 3,
            name: "Mr. Suresh Gupta",
            subject: "Chemistry",
            qualification: "M.Sc. Chemistry, NET Qualified (12+ Years Experience)",
            image: sureshGuptaImg
        },
        {
            id: 4,
            name: "Mrs. Priya Singh",
            subject: "Biology",
            qualification: "M.Sc. Zoology, B.Ed (8+ Years Experience)",
            image: priyaSinghImg
        },
        {
            id: 5,
            name: "Mr. Amit Patel",
            subject: "English",
            qualification: "M.A. English, M.Phil (20+ Years Experience)",
            image: amitPatelImg
        },
        {
            id: 6,
            name: "Ms. Neha Agarwal",
            subject: "Computer Science",
            qualification: "MCA, B.Tech CS (5+ Years Experience)",
            image: nehaAgarwalImg
        }
    ];

    return (
        <section className="faculty-page" style={{ padding: '120px 0 60px' }}>
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our Expert <span className="highlight">Faculty</span></h2>
                    <p className="section-subtitle">Meet the mentors who will guide you to success.</p>
                </div>
                <div className="faculty-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    marginTop: '40px'
                }}>
                    {facultyData.map((member) => (
                        <div key={member.id} className="faculty-card" style={{
                            background: '#fff',
                            borderRadius: '15px',
                            padding: '30px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div className="faculty-img" style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                margin: '0 auto 20px',
                                overflow: 'hidden',
                                border: '4px solid #f0f0f0'
                            }}>
                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ color: '#1a237e', marginBottom: '5px' }}>{member.name}</h3>
                            <h4 style={{ color: '#ffab00', fontSize: '1.1rem', marginBottom: '15px' }}>{member.subject}</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>{member.qualification}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faculty;
