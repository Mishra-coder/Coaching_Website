import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error.message);
        console.error('Please check EMAIL_USER and EMAIL_PASSWORD in .env file');
    } else {
        console.log('Email server is ready to send messages');
    }
});

async function sendEmail(to, subject, html) {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('Email credentials not configured');
            return { success: false, error: 'Email not configured' };
        }

        const mailOptions = {
            from: `"Success Mantra Institute" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to, '- Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send failed to:', to);
        console.error('Error details:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication failed - Check EMAIL_USER and EMAIL_PASSWORD in .env');
        }
        return { success: false, error: error.message };
    }
}

export async function sendEnrollmentConfirmation(user, enrollment) {
    const subject = 'Admission Form Submitted - Success Mantra Institute';
    
    const emailStyles = `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .logo-title { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }
        .logo-icon { font-size: 2rem; }
        .header h1 { margin: 0; font-size: 1.8rem; }
        .header p { margin: 10px 0 0 0; font-size: 1rem; opacity: 0.95; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .info-label { font-weight: bold; width: 150px; color: #667eea; }
        .info-value { flex: 1; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
        .status-badge { display: inline-block; padding: 5px 15px; background: #ffc107; color: #000; border-radius: 20px; font-size: 12px; font-weight: bold; }
    `;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${emailStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-title">
                    <span class="logo-icon">🎓</span>
                    <h1>Success Mantra Institute</h1>
                </div>
                <p>Admission Form Submitted Successfully</p>
            </div>
            
            <div class="content">
                <p>Dear <strong>${enrollment.studentName}</strong>,</p>
                
                <p>Thank you for submitting your admission form to Success Mantra Institute. We have received your application and it is currently under review.</p>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #667eea;">Application Details</h3>
                    
                    <div class="info-row">
                        <span class="info-label">Application ID:</span>
                        <span class="info-value">${enrollment._id}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Student Name:</span>
                        <span class="info-value">${enrollment.studentName}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Father's Name:</span>
                        <span class="info-value">${enrollment.fatherName}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Mobile Number:</span>
                        <span class="info-value">${enrollment.mobileNumber}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Date of Birth:</span>
                        <span class="info-value">${enrollment.dateOfBirth.day}/${enrollment.dateOfBirth.month}/${enrollment.dateOfBirth.year}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value"><span class="status-badge">PENDING REVIEW</span></span>
                    </div>
                </div>
                
                <h3 style="color: #667eea;">Next Steps:</h3>
                <ul>
                    <li>Our team will review your application within 24-48 hours</li>
                    <li>You will receive an email notification once reviewed</li>
                    <li>Check your application status in your profile</li>
                    <li>You can resubmit from your profile if changes are needed</li>
                </ul>
                
                <div style="text-align: center;">
                    <p style="margin: 30px 0 10px 0; color: #6c757d;">For any queries, contact us:</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${enrollment.mobileNumber}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
                <p>&copy; 2026 Success Mantra Institute. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    await sendEmail(user.email, subject, html);
    
    const adminEmail = process.env.ADMIN_EMAIL || 'mysuccessmantrainstitute@gmail.com';
    const adminSubject = 'New Admission Form Submitted';
    
    const adminEmailStyles = `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .logo-title { display: flex; align-items: center; justify-content: center; gap: 15px; }
        .logo-icon { font-size: 2.5rem; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .info-label { font-weight: bold; width: 150px; color: #667eea; }
        .info-value { flex: 1; }
        .student-photo { width: 150px; height: 150px; border-radius: 10px; object-fit: cover; margin: 20px auto; display: block; border: 3px solid #667eea; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 15px 40px; margin: 0 10px; text-decoration: none; border-radius: 50px; font-weight: bold; color: white; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .btn-approve { background: #28a745; }
        .btn-cancel { background: #dc3545; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    `;
    
    const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${adminEmailStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-title">
                    <span class="logo-icon">🎓</span>
                    <h1 style="margin: 0;">Success Mantra Institute</h1>
                </div>
                <p style="margin: 10px 0 0 0;">New Admission Form Received</p>
            </div>
            
            <div class="content">
                <p>A new admission form has been submitted and requires your review.</p>
                
                <div class="info-box">
                    <h3 style="margin-top: 0; color: #667eea;">Student Details</h3>
                    
                    <div class="info-row">
                        <span class="info-label">Application ID:</span>
                        <span class="info-value">${enrollment._id}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Student Name:</span>
                        <span class="info-value">${enrollment.studentName}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Father's Name:</span>
                        <span class="info-value">${enrollment.fatherName}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Mother's Name:</span>
                        <span class="info-value">${enrollment.motherName}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Mobile Number:</span>
                        <span class="info-value">${enrollment.mobileNumber}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${user.email}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Date of Birth:</span>
                        <span class="info-value">${enrollment.dateOfBirth.day}/${enrollment.dateOfBirth.month}/${enrollment.dateOfBirth.year}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Gender:</span>
                        <span class="info-value" style="text-transform: capitalize;">${enrollment.gender}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Aadhar Number:</span>
                        <span class="info-value">${enrollment.aadharNumber}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">Address:</span>
                        <span class="info-value">${enrollment.address}</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin?id=${enrollment._id}&action=approve" class="btn btn-approve">
                        Approve Application
                    </a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin?id=${enrollment._id}&action=cancel" class="btn btn-cancel">
                        Cancel Application
                    </a>
                </div>
                
                <p style="text-align: center; margin-top: 20px; color: #6c757d;">
                    Or review this application in the admin panel
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from Success Mantra Institute.</p>
                <p>&copy; 2026 Success Mantra Institute. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    await sendEmail(adminEmail, adminSubject, adminHtml);
}

export async function sendStatusUpdateEmail(user, enrollment, oldStatus, newStatus) {
    let subject = '';
    let statusMessage = '';
    let statusColor = '';
    
    if (newStatus === 'active') {
        subject = 'Admission Approved - Success Mantra Institute';
        statusMessage = 'Congratulations! Your admission has been approved.';
        statusColor = '#28a745';
    } else if (newStatus === 'cancelled') {
        subject = 'Admission Status Update - Success Mantra Institute';
        statusMessage = 'Your admission application requires attention.';
        statusColor = '#dc3545';
    } else {
        subject = 'Admission Status Update - Success Mantra Institute';
        statusMessage = 'Your admission application status has been updated.';
        statusColor = '#ffc107';
    }
    
    const emailStyles = `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-box { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${statusColor}; text-align: center; }
        .status-badge { display: inline-block; padding: 10px 20px; background: ${statusColor}; color: white; border-radius: 20px; font-size: 14px; font-weight: bold; text-transform: uppercase; }
        .remarks-box { background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    `;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${emailStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Success Mantra Institute</h1>
                <p>Admission Status Update</p>
            </div>
            
            <div class="content">
                <p>Dear <strong>${enrollment.studentName}</strong>,</p>
                
                <div class="status-box">
                    <h2 style="margin-top: 0; color: ${statusColor};">${statusMessage}</h2>
                    <p style="margin: 20px 0;">Your application status has been updated to:</p>
                    <span class="status-badge">${newStatus.toUpperCase()}</span>
                </div>
                
                ${enrollment.adminRemarks ? `
                <div class="remarks-box">
                    <h4 style="margin-top: 0; color: #856404;">Admin Remarks:</h4>
                    <p style="margin: 0;">${enrollment.adminRemarks}</p>
                </div>
                ` : ''}
                
                <p><strong>Application ID:</strong> ${enrollment._id}</p>
                
                ${newStatus === 'active' ? `
                <h3 style="color: #667eea;">Welcome to Success Mantra Institute!</h3>
                <p>Your admission has been confirmed. Please visit the institute for further formalities and fee payment.</p>
                <ul>
                    <li>Bring original documents for verification</li>
                    <li>Complete the fee payment process</li>
                    <li>Collect your student ID card</li>
                    <li>Get your class schedule</li>
                </ul>
                ` : ''}
                
                ${newStatus === 'cancelled' ? `
                <p>You can resubmit your admission form by visiting your profile page and updating the required information.</p>
                ` : ''}
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #6c757d;">For any queries, contact us:</p>
                    <p><strong>Phone:</strong> ${enrollment.mobileNumber}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
                <p>&copy; 2026 Success Mantra Institute. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    await sendEmail(user.email, subject, html);
};
