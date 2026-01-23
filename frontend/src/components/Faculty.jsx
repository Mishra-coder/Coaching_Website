import React from 'react';
import vikasSirImg from '../assets/vikas_sir.png';
import himanshuSirImg from '../assets/himanshu_sir.png';
import sureshGuptaImg from '../assets/suresh_gupta.png';
import priyaSinghImg from '../assets/priya_singh.png';
import amitPatelImg from '../assets/amit_patel.png';
import nehaAgarwalImg from '../assets/neha_agarwal.png';

const Faculty = () => {
    const teachingStaff = [
        {
            id: 1,
            fullName: "Mr. Vikas Sir",
            specialization: "Mathematics",
            details: "M.Sc. Mathematics, B.Ed (15+ Years Experience)",
            photo: vikasSirImg
        },
        {
            id: 2,
            fullName: "Mr. Himanshu Sir",
            specialization: "Physics",
            details: "M.Sc. Physics, Gold Medalist (10+ Years Experience)",
            photo: himanshuSirImg
        },
        {
            id: 3,
            fullName: "Mr. Suresh Gupta",
            specialization: "Chemistry",
            details: "M.Sc. Chemistry, NET Qualified (12+ Years Experience)",
            photo: sureshGuptaImg
        },
        {
            id: 4,
            fullName: "Mrs. Priya Singh",
            specialization: "Biology",
            details: "M.Sc. Zoology, B.Ed (8+ Years Experience)",
            photo: priyaSinghImg
        },
        {
            id: 5,
            fullName: "Mr. Amit Patel",
            specialization: "English",
            details: "M.A. English, M.Phil (20+ Years Experience)",
            photo: amitPatelImg
        },
        {
            id: 6,
            fullName: "Ms. Neha Agarwal",
            specialization: "Computer Science",
            details: "MCA, B.Tech CS (5+ Years Experience)",
            photo: nehaAgarwalImg
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
                    {teachingStaff.map((member) => (
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
                                <img src={member.photo} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ color: '#1a237e', marginBottom: '5px' }}>{member.fullName}</h3>
                            <h4 style={{ color: '#ffab00', fontSize: '1.1rem', marginBottom: '15px' }}>{member.specialization}</h4>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>{member.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faculty;