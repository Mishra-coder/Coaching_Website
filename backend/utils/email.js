import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to, subject, html) {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('Email not configured');
            return { success: false };
        }

        const mailOptions = {
            from: `"Success Mantra Institute" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
        return { success: true };
    } catch (error) {
        console.error('Email send failed:', error.message);
        return { success: false, error: error.message };
    }
}

export async function sendEnrollmentConfirmation(user, enrollment) {
    const subject = 'Admission Form Submitted - Success Mantra Institute';
    
    const emailStyles = `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
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
                <h1>Success Mantra Institute</h1>
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
                    <li>You will receive an email notification once your application is reviewed</li>
                    <li>Keep your mobile number active for any updates</li>
                    <li>You can check your application status anytime by logging into your account</li>
                </ul>
                
                <p><strong>Important:</strong> If you need to make any changes to your application, please contact us immediately.</p>
                
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
};

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
                <p>If you have any questions or would like to resubmit your application, please contact us.</p>
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
