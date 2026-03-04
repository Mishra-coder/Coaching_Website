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
        class: '',
        board: '',
        address: '',
        aadhar: '',
        mobile: ''
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
                class: enrollment.class || '',
                board: enrollment.board || '',
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
            if (file.size > 2 * 1024 * 1024) {
                setStatusMessage({ type: 'error', text: 'Photo size should be less than 2MB' });
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    const maxSize = 800;
                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setStudentPhoto(compressedBase64);
                };
                img.src = reader.result;
            };
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
                class: details.class,
                board: details.board,
                address: details.address,
                aadharNumber: details.aadhar,
                mobileNumber: details.mobile,
                photo: studentPhoto
            };

            const response = isEditing
                ? await enrollmentsAPI.update(editId, submission)
                : await enrollmentsAPI.create(submission);

            if (response.success) {
                setStatusMessage({ 
                    type: 'success', 
                    text: isEditing ? 'Form updated successfully! Redirecting...' : 'Enrollment successful! Redirecting...' 
                });
                window.scrollTo(0, 0);
                setTimeout(() => {
                    navigate('/profile');
                }, 1000);
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setStatusMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Submission failed. Please try again.' 
            });
            window.scrollTo(0, 0);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="admission-page">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="admission-form-wrapper">
                    <div className="admission-form-header">
                        <div className="admission-icon-wrapper">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h2 className="admission-main-title">Admission Form</h2>
                        <p className="admission-subtitle">Join Success Mantra Institute - Your Path to Excellence</p>
                    </div>

                    <form className="modern-admission-form" onSubmit={onFormSubmit}>
                        {statusMessage.text && (
                            <div className={`modern-alert ${statusMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                                <i className={`fas ${statusMessage.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                                <span>{statusMessage.text}</span>
                            </div>
                        )}

                        <div className="photo-upload-section">
                            <label className="photo-upload-label">Student Photo</label>
                            <div className="photo-upload-box" onClick={() => fileInput.current.click()}>
                                {studentPhoto ? (
                                    <img src={studentPhoto} alt="Student" className="uploaded-photo" />
                                ) : (
                                    <div className="photo-placeholder">
                                        <i className="fas fa-camera"></i>
                                        <span>Click to Upload Photo</span>
                                        <small>JPG, PNG (Max 2MB)</small>
                                    </div>
                                )}
                                <input type="file" accept="image/*" hidden ref={fileInput} onChange={onFileSelect} />
                            </div>
                        </div>

                        <div className="form-section-modern">
                            <div className="section-title-bar">
                                <i className="fas fa-user-circle"></i>
                                <h4>Personal Information</h4>
                            </div>

                            <div className="form-grid">
                                <div className="form-field full-width">
                                    <label className="modern-label">Full Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={details.studentName}
                                        onChange={updateField}
                                        placeholder="Enter student's full name"
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Father's Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={details.fatherName}
                                        onChange={updateField}
                                        placeholder="Enter father's name"
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Mother's Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={details.motherName}
                                        onChange={updateField}
                                        placeholder="Enter mother's name"
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Date of Birth <span className="required">*</span></label>
                                    <div className="dob-inputs">
                                        <input type="number" name="birthDay" value={details.birthDay} onChange={updateField} placeholder="DD" min="1" max="31" required className="modern-input" inputMode="numeric" />
                                        <input type="number" name="birthMonth" value={details.birthMonth} onChange={updateField} placeholder="MM" min="1" max="12" required className="modern-input" inputMode="numeric" />
                                        <input type="number" name="birthYear" value={details.birthYear} onChange={updateField} placeholder="YYYY" min="2000" max="2025" required className="modern-input" inputMode="numeric" />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Gender <span className="required">*</span></label>
                                    <div className="gender-options">
                                        <label className="gender-option">
                                            <input type="radio" name="gender" value="male" checked={details.gender === 'male'} onChange={updateField} required />
                                            <span className="gender-label">
                                                <i className="fas fa-mars"></i> Male
                                            </span>
                                        </label>
                                        <label className="gender-option">
                                            <input type="radio" name="gender" value="female" checked={details.gender === 'female'} onChange={updateField} required />
                                            <span className="gender-label">
                                                <i className="fas fa-venus"></i> Female
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Class <span className="required">*</span></label>
                                    <select
                                        name="class"
                                        value={details.class}
                                        onChange={updateField}
                                        required
                                        className="modern-input"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="1">Class 1st</option>
                                        <option value="2">Class 2nd</option>
                                        <option value="3">Class 3rd</option>
                                        <option value="4">Class 4th</option>
                                        <option value="5">Class 5th</option>
                                        <option value="6">Class 6th</option>
                                        <option value="7">Class 7th</option>
                                        <option value="8">Class 8th</option>
                                        <option value="9">Class 9th</option>
                                        <option value="10">Class 10th</option>
                                        <option value="11">Class 11th</option>
                                        <option value="12">Class 12th</option>
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Board <span className="required">*</span></label>
                                    <select
                                        name="board"
                                        value={details.board}
                                        onChange={updateField}
                                        required
                                        className="modern-input"
                                    >
                                        <option value="">Select Board</option>
                                        <option value="CBSE">CBSE</option>
                                        <option value="ICSE">ICSE</option>
                                        <option value="State Board">State Board</option>
                                    </select>
                                </div>

                                <div className="form-field full-width">
                                    <label className="modern-label">Address <span className="required">*</span></label>
                                    <textarea
                                        name="address"
                                        value={details.address}
                                        onChange={updateField}
                                        placeholder="Enter complete address"
                                        rows="3"
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Aadhar Number <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="aadhar"
                                        value={details.aadhar}
                                        onChange={updateField}
                                        placeholder="Enter 12-digit Aadhar"
                                        pattern="[0-9]{12}"
                                        maxLength="12"
                                        inputMode="numeric"
                                        required
                                        className="modern-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="modern-label">Mobile Number <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={details.mobile}
                                        onChange={updateField}
                                        placeholder="Enter 10-digit mobile"
                                        pattern="[0-9]{10}"
                                        required
                                        className="modern-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="declaration-box">
                            <div className="declaration-icon">
                                <i className="fas fa-file-contract"></i>
                            </div>
                            <div className="declaration-content">
                                <h5>Declaration</h5>
                                <p>कोचिंग के नियमो का पालन करना होगा एवं अनुशासन में रहना होगा। यदि आप कोचिंग के नियमो का उल्लंघन करते है तो आपका नाम निरस्त कर दिया जायेगा।</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn-modern"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i> Submit Admission Form
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdmissionForm;