import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export async function addUserToSheet(user) {
    if (!SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.log('Google Sheets not configured, skipping...');
        return;
    }

    try {
        const currentDate = new Date().toLocaleString('en-IN');
        const userId = user._id.toString();
        const userName = user.name || '';
        const userEmail = user.email || '';
        const userRole = user.role || 'student';
        const verificationStatus = user.isVerified ? 'Yes' : 'No';

        const rowData = [[
            currentDate,
            userId,
            userName,
            userEmail,
            userRole,
            verificationStatus
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Users!A:F',
            valueInputOption: 'USER_ENTERED',
            resource: { values: rowData }
        });

        console.log('User added to Google Sheet:', user.email);
    } catch (error) {
        console.error('Failed to add user to Google Sheet:', error.message);
    }
}

export async function addEnrollmentToSheet(enrollment, user) {
    if (!SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.log('Google Sheets not configured, skipping...');
        return;
    }

    try {
        const submissionDate = new Date().toLocaleString('en-IN');
        const enrollmentId = enrollment._id.toString();
        
        const dob = enrollment.dateOfBirth;
        const dateOfBirth = `${dob.day}/${dob.month}/${dob.year}`;
        
        const rowData = [[
            submissionDate,
            enrollmentId,
            enrollment.studentName || '',
            enrollment.fatherName || '',
            enrollment.motherName || '',
            dateOfBirth,
            enrollment.gender || '',
            enrollment.aadharNumber || '',
            enrollment.mobileNumber || '',
            enrollment.address || '',
            user.email || '',
            enrollment.status || 'pending',
            enrollment.adminRemarks || '',
            enrollment.class || '',
            enrollment.board || '',
            enrollment.competitiveCourse || ''
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Enrollments!A:P',
            valueInputOption: 'USER_ENTERED',
            resource: { values: rowData }
        });

        console.log('Enrollment added to Google Sheet:', enrollment.studentName);
    } catch (error) {
        console.error('Failed to add enrollment to Google Sheet:', error.message);
    }
}

export async function updateEnrollmentStatusInSheet(enrollmentId, status, adminRemarks) {
    if (!SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.log('Google Sheets not configured, skipping...');
        return;
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Enrollments!A:P'
        });

        const allRows = response.data.values;
        if (!allRows) {
            return;
        }

        const targetEnrollmentId = enrollmentId.toString();
        let foundRowIndex = -1;

        for (let i = 0; i < allRows.length; i++) {
            if (allRows[i][1] === targetEnrollmentId) {
                foundRowIndex = i;
                break;
            }
        }
        
        if (foundRowIndex !== -1) {
            const rowNumber = foundRowIndex + 1;
            const updateRange = `Enrollments!L${rowNumber}:M${rowNumber}`;
            
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: updateRange,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [[status, adminRemarks || '']]
                }
            });
            
            console.log('Enrollment status updated in Google Sheet');
        }
    } catch (error) {
        console.error('Failed to update enrollment in Google Sheet:', error.message);
    }
}
