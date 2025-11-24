import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentsAPI } from '../services/api';
const AdmissionForm = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const fileInputRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        studentName: '',
        fatherName: '',
        motherName: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
        gender: '',
        address: '',
        aadharNumber: '',
        mobileNumber: '',
        admissionDate: new Date().toISOString().split('T')[0]
    });
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const enrollmentData = {
                studentName: formData.studentName,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                dateOfBirth: {
                    day: parseInt(formData.dobDay),
                    month: parseInt(formData.dobMonth),
                    year: parseInt(formData.dobYear)
                },
                gender: formData.gender,
                address: formData.address,
                aadharNumber: formData.aadharNumber,
                mobileNumber: formData.mobileNumber,
                photo: photo
            };
            const response = await enrollmentsAPI.create(enrollmentData);
            if (response.success) {
                alert('Form submitted successfully!');
                navigate('/');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };
    const classOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    const mediumOptions = ['English', 'Hindi'];
    return (
        <div className="contact-form-wrapper">
            <form className="contact-form admission-form" onSubmit={handleSubmit}>
                { }
                <div className="form-header">
                    <h3>Admission Form</h3>
                    { }
                    <div className="photo-upload" onClick={handlePhotoClick}>
                        {photo ? (
                            <img
                                src={photo}
                                alt="Student"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />
                        ) : (
                            <div className="photo-placeholder">
                                <i className="fas fa-camera"></i>
                                <span>Upload Photo</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                { }
                {error && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '20px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
                { }
                <div className="form-section">
                    <h5>Personal Information</h5>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            placeholder="Enter Student's Full Name"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Father's Name</label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                placeholder="Enter Father's Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mother's Name</label>
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                placeholder="Enter Mother's Name"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <div className="dob-inputs">
                                <input
                                    type="number"
                                    name="dobDay"
                                    value={formData.dobDay}
                                    onChange={handleChange}
                                    placeholder="DD"
                                    min="1"
                                    max="31"
                                    required
                                />
                                <input
                                    type="number"
                                    name="dobMonth"
                                    value={formData.dobMonth}
                                    onChange={handleChange}
                                    placeholder="MM"
                                    min="1"
                                    max="12"
                                    required
                                />
                                <input
                                    type="number"
                                    name="dobYear"
                                    value={formData.dobYear}
                                    onChange={handleChange}
                                    placeholder="YYYY"
                                    min="2000"
                                    max="2025"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <div className="gender-options">
                                <label className="radio-container">
                                    Male
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <label className="radio-container">
                                    Female
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter Full Address"
                            rows="2"
                            required
                        ></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Aadhar No</label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                placeholder="12-digit Aadhar Number"
                                pattern="[0-9]{12}"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile No</label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="10-digit Mobile Number"
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* Declaration */}
                <div className="declaration-box">
                    <h5>DECLARATION :</h5>
                    <p>
                        कोचिंग के नियमो का पालन करना होगा एवं अनुशासन में रहना होगा यदि आप
                        कोचिंग के नियमो का उलघन करते है तो आपका नाम निरस्त कर दिया जायेगा |
                    </p>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-primary full-width"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Processing...' : 'Submit the Form'}
                </button>
            </form>
        </div>
    );
};
export default AdmissionForm;