import React from 'react';
import { Link } from 'react-router-dom';



const Courses = () => {
    const sectionTitleStyle = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1a237e'
    };

    const gridContainerStyle = {
        marginBottom: '60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px'
    };

    const categoryCardStyle = {
        background: '#fff',
        borderRadius: '24px',
        padding: '25px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        border: '1px solid rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    };

    const tagStyle = {
        padding: '6px 16px',
        borderRadius: '50px',
        border: '1px solid #e0e0e0',
        color: '#444',
        fontSize: '0.85rem',
        fontWeight: '600',
        background: '#fff'
    };

    const enrollButtonStyle = {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1a237e',
        marginRight: '12px'
    };

    const arrowCircleStyle = {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease'
    };

    const handleCardHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.12)';
    };

    const handleCardLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
    };

    const competitiveExams = [
        {
            title: 'Govt Job Exams',
            tags: ['SSC', 'Banking', 'Teaching', 'Judiciary'],
            icon: 'fa-landmark',
            bgColor: '#e3f2fd',
            iconColor: '#1a237e'
        },
        {
            title: 'Defence',
            tags: ['NDA', 'CDS', 'AFCAT', 'Agniveer'],
            icon: 'fa-shield-alt',
            bgColor: '#e0f2f1',
            iconColor: '#00695c'
        },
        {
            title: 'UPSC',
            tags: [],
            icon: 'fa-users',
            bgColor: '#fff3e0',
            iconColor: '#ef6c00'
        }
    ];

    const schoolClasses = [
        {
            title: 'Junior Wing',
            grade: 'Class 1st - 5th',
            features: ['Strong Basics', 'Activity Based Learning'],
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            featured: false
        },
        {
            title: 'Middle Wing',
            grade: 'Class 6th - 8th',
            features: ['Concept Building', 'Olympiad Prep'],
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            featured: false
        },
        {
            title: 'Senior Wing',
            grade: 'Class 9th - 12th',
            features: ['Board Exam Excellence', 'PCM / PCB / Commerce'],
            gradient: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
            featured: true
        }
    ];

    const renderCategoryCard = (category) => {
        const illustrationStyle = {
            position: 'absolute',
            right: '-30px',
            bottom: '-30px',
            width: '180px',
            height: '180px',
            background: category.bgColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0.6',
            zIndex: '0'
        };

        return (
            <Link key={category.title} to="/enroll" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                    className="category-card"
                    style={categoryCardStyle}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                >
                    <div style={{ zIndex: 1 }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#000', marginBottom: '15px' }}>
                            {category.title}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '65%' }}>
                            {category.tags.map((tag, i) => (
                                <span key={i} style={tagStyle}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', zIndex: 1 }}>
                        <span style={enrollButtonStyle}>Enroll Now</span>
                        <div style={arrowCircleStyle}>
                            <i className="fas fa-arrow-right" style={{ color: '#333', fontSize: '0.9rem' }}></i>
                        </div>
                    </div>

                    <div style={illustrationStyle}>
                        <i
                            className={`fas ${category.icon}`}
                            style={{
                                fontSize: '5rem',
                                color: category.iconColor,
                                transform: 'translate(-10px, -10px)'
                            }}
                        ></i>
                    </div>
                </div>
            </Link>
        );
    };

    const renderSchoolCard = (classInfo) => {
        const enrollNowButtonStyle = {
            backgroundColor: '#ffab00',
            color: '#1a237e',
            borderRadius: '50px',
            padding: '10px 20px',
            fontWeight: 'bold',
            border: 'none',
            display: 'block',
            marginTop: '15px',
            textAlign: 'center'
        };

        return (
            <Link
                key={classInfo.title}
                to="/enroll"
                className={`program-card ${classInfo.featured ? 'featured' : ''}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {classInfo.featured && <div className="popular-tag">Board Focus</div>}

                <div className="card-header" style={{ background: classInfo.gradient, color: '#fff', padding: '30px' }}>
                    <h3>{classInfo.title}</h3>
                    <span className="grade">{classInfo.grade}</span>
                </div>

                <div className="card-body">
                    <ul>
                        {classInfo.features.map((feature, i) => (
                            <li key={i}>
                                <i className="fas fa-check"></i> {feature}
                            </li>
                        ))}
                    </ul>
                    <span style={enrollNowButtonStyle}>Enroll Now</span>
                </div>
            </Link>
        );
    };

    return (
        <section id="programs" className="programs" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div className="section-header">
                    <h2>Our <span className="highlight">Courses</span></h2>
                    <p>Comprehensive coaching for School and Competitive Exams.</p>
                </div>

                <h3 style={sectionTitleStyle}>Competitive Exams</h3>
                <div className="program-grid" style={gridContainerStyle}>
                    {competitiveExams.map(renderCategoryCard)}
                </div>

                <h3 style={sectionTitleStyle}>School Classes</h3>
                <div className="program-grid">
                    {schoolClasses.map(renderSchoolCard)}
                </div>
            </div>
        </section>
    );
};

export default Courses;
