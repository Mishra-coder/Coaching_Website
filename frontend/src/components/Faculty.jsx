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
        <section className="faculty-page">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our Expert <span className="highlight">Faculty</span></h2>
                    <p className="section-subtitle">Meet the mentors who will guide you to success.</p>
                </div>

                <div className="faculty-grid">
                    {teachingStaff.map((member) => (
                        <div key={member.id} className="faculty-card">
                            <div className="faculty-img-container">
                                <img
                                    src={member.photo}
                                    alt={member.fullName}
                                    className="faculty-img"
                                />
                            </div>
                            <h3 className="faculty-name">{member.fullName}</h3>
                            <h4 className="faculty-role">{member.specialization}</h4>
                            <p className="faculty-desc">{member.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faculty;