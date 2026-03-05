import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

export async function addUserToSheet(user) {
    if (!SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.log('Google Sheets not configured, skipping...');
        return;
    }

    try {
        const values = [[
            new Date().toLocaleString('en-IN'),
            user._id.toString(),
            user.name || '',
            user.email || '',
            user.role || 'student',
            user.isVerified ? 'Yes' : 'No'
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Users!A:F',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
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
        const values = [[
            new Date().toLocaleString('en-IN'),
            enrollment._id.toString(),
            enrollment.studentName || '',
            enrollment.fatherName || '',
            enrollment.motherName || '',
            `${enrollment.dateOfBirth.day}/${enrollment.dateOfBirth.month}/${enrollment.dateOfBirth.year}`,
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
            resource: { values },
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
            range: 'Enrollments!A:P',
        });

        const rows = response.data.values;
        if (!rows) return;

        const rowIndex = rows.findIndex(row => row[1] === enrollmentId.toString());
        
        if (rowIndex !== -1) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `Enrollments!L${rowIndex + 1}:M${rowIndex + 1}`,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [[status, adminRemarks || '']]
                },
            });
            console.log('Enrollment status updated in Google Sheet');
        }
    } catch (error) {
        console.error('Failed to update enrollment in Google Sheet:', error.message);
    }
}
