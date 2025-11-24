import React from 'react';
import AdmissionForm from './AdmissionForm';
const Enrollment = () => {
    return (
        <section className="enrollment-page" style={{ padding: '120px 0 60px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Admission <span className="highlight">Form</span></h2>
                    <p className="section-subtitle">Take the first step towards your success.</p>
                </div>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <AdmissionForm />
                </div>
            </div>
        </section>
    );
};
export default Enrollment;