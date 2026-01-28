import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentsAPI } from '../services/api';

const AdmissionForm = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const fileInput = useRef(null);

    const [studentPhoto, setStudentPhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const [details, setDetails] = useState({
        studentName: '',
        fatherName: '',
        motherName: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        gender: '',
        address: '',
        aadhar: '',
        mobile: '',
        dateJoined: new Date().toISOString().split('T')[0]
    });

    const location = useLocation();
    const editId = new URLSearchParams(location.search).get('edit');
    const isEditing = !!editId;

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        if (editId) loadRecord();
    }, [isAuthenticated, editId]);

    const loadRecord = async () => {
        try {
            setIsSubmitting(true);
            const { enrollment } = await enrollmentsAPI.getById(editId);
            setDetails({
                studentName: enrollment.studentName,
                fatherName: enrollment.fatherName,
                motherName: enrollment.motherName,
                birthDay: enrollment.dateOfBirth.day.toString(),
                birthMonth: enrollment.dateOfBirth.month.toString(),
                birthYear: enrollment.dateOfBirth.year.toString(),
                gender: enrollment.gender,
                address: enrollment.address,
                aadhar: enrollment.aadharNumber,
                mobile: enrollment.mobileNumber,
                dateJoined: new Date(enrollment.createdAt).toISOString().split('T')[0]
            });
            setStudentPhoto(enrollment.photo);
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Failed to load existing record' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setStudentPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const updateField = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if (!studentPhoto) {
            setStatusMessage({ type: 'error', text: 'Please upload the student photo' });
            window.scrollTo(0, 0);
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const submission = {
                studentName: details.studentName,
                fatherName: details.fatherName,
                motherName: details.motherName,
                dateOfBirth: {
                    day: parseInt(details.birthDay),
                    month: parseInt(details.birthMonth),
                    year: parseInt(details.birthYear)
                },
                gender: details.gender,
                address: details.address,
                aadharNumber: details.aadhar,
                mobileNumber: details.mobile,
                photo: studentPhoto
            };

            const response = isEditing
                ? await enrollmentsAPI.update(editId, submission)
                : await enrollmentsAPI.create(submission);

            if (response.success) {
                alert(isEditing ? 'Form updated successfully!' : 'Enrollment successful!');
                navigate('/profile');
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="admission-page">
            <div className="container">
                <div className="admission-form-wrapper">
                    <form className="contact-form" onSubmit={onFormSubmit}>
                        <div className="form-header-row">
                            <h3 className="form-title">Admission Form</h3>

                            <div className="photo-upload-area" onClick={() => fileInput.current.click()}>
                                {studentPhoto ? (
                                    <img src={studentPhoto} alt="Student" className="photo-preview" />
                                ) : (
                                    <div className="photo-placeholder-content">
                                        <i className="fas fa-camera photo-icon" />
                                        <span className="photo-text">Upload Photo</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" hidden ref={fileInput} onChange={onFileSelect} />
                            </div>
                        </div>

                        {statusMessage.text && (
                            <div className={`form-alert ${statusMessage.type === 'error' ? 'form-input-error' : ''}`} style={{ backgroundColor: statusMessage.type === 'error' ? '#fee' : '#ecfdf5', color: statusMessage.type === 'error' ? '#c33' : '#047857' }}>
                                {statusMessage.text}
                            </div>
                        )}

                        <div className="form-section">
                            <h5 className="form-section-label">Personal Information</h5>

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="studentName"
                                    value={details.studentName}
                                    onChange={updateField}
                                    placeholder="Student's Name"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Father's Name</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={details.fatherName}
                                        onChange={updateField}
                                        placeholder="Father's Name"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Mother's Name</label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={details.motherName}
                                        onChange={updateField}
                                        placeholder="Mother's Name"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <div className="dob-grid">
                                        <input type="number" name="birthDay" value={details.birthDay} onChange={updateField} placeholder="DD" min="1" max="31" required className="form-input" />
                                        <input type="number" name="birthMonth" value={details.birthMonth} onChange={updateField} placeholder="MM" min="1" max="12" required className="form-input" />
                                        <input type="number" name="birthYear" value={details.birthYear} onChange={updateField} placeholder="YYYY" min="2000" max="2025" required className="form-input" />
                                    </div>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Gender</label>
                                    <div className="gender-select-group">
                                        {['male', 'female'].map(g => (
                                            <label key={g} className="radio-label">
                                                <span className="radio-text">{g}</span>
                                                <input type="radio" name="gender" value={g} checked={details.gender === g} onChange={updateField} required className="radio-input" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    value={details.address}
                                    onChange={updateField}
                                    placeholder="Full Home Address"
                                    rows="2"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Aadhar No</label>
                                    <input
                                        type="text"
                                        name="aadhar"
                                        value={details.aadhar}
                                        onChange={updateField}
                                        placeholder="12-digit Number"
                                        pattern="[0-9]{12}"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Mobile No</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={details.mobile}
                                        onChange={updateField}
                                        placeholder="10-digit Number"
                                        pattern="[0-9]{10}"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="declaration-container">
                            <h5 className="declaration-title">DECLARATION :</h5>
                            <p className="declaration-text">कोचिंग के नियमो का पालन करना होगा एवं अनुशासन में रहना होगा यदि आप कोचिंग के नियमो का उलघन करते है तो आपका नाम निरस्त कर दिया जायेगा |</p>
                        </div>

                        <button
                            type="submit"
                            className={`btn-primary btn-block ${isSubmitting ? 'btn-loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Admission'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdmissionForm;