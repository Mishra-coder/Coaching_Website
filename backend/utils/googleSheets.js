import { google } from 'googleapis';

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: serviceEmail,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheetsAPI = google.sheets({ version: 'v4', auth });

export async function addUserToSheet(user) {
  if (!spreadsheetId || !serviceEmail) {
    console.log('Google Sheets not configured, skipping...');
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('en-IN');
    const userId = user._id.toString();
    const userName = user.name || '';
    const userEmail = user.email || '';
    const userRole = user.role || 'student';
    const isVerified = user.isVerified ? 'Yes' : 'No';

    const rowData = [
      [timestamp, userId, userName, userEmail, userRole, isVerified],
    ];

    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'SignUp!A:F',
      valueInputOption: 'USER_ENTERED',
      resource: { values: rowData },
    });

    console.log('User added to Google Sheet:', user.email);
  } catch (error) {
    console.error('Failed to add user to Google Sheet:', error.message);
  }
}

export async function addEnrollmentToSheet(enrollment, user) {
  if (!spreadsheetId || !serviceEmail) {
    console.log('Google Sheets not configured, skipping...');
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('en-IN');
    const enrollmentId = enrollment._id.toString();
    const dob = enrollment.dateOfBirth;
    const formattedDOB = `${dob.day}/${dob.month}/${dob.year}`;

    const rowData = [
      [
        timestamp,
        enrollmentId,
        enrollment.studentName || '',
        enrollment.fatherName || '',
        enrollment.motherName || '',
        formattedDOB,
        enrollment.gender || '',
        enrollment.aadharNumber || '',
        enrollment.mobileNumber || '',
        enrollment.address || '',
        user.email || '',
        enrollment.status || 'pending',
        enrollment.adminRemarks || '',
        enrollment.class || '',
        enrollment.board || '',
        enrollment.competitiveCourse || '',
      ],
    ];

    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Enrollments!A:P',
      valueInputOption: 'USER_ENTERED',
      resource: { values: rowData },
    });

    console.log('Enrollment added to Google Sheet:', enrollment.studentName);
  } catch (error) {
    console.error('Failed to add enrollment to Google Sheet:', error.message);
  }
}

export async function updateEnrollmentStatusInSheet(
  enrollmentId,
  status,
  adminRemarks
) {
  if (!spreadsheetId || !serviceEmail) {
    console.log('Google Sheets not configured, skipping...');
    return;
  }

  try {
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Enrollments!A:P',
    });

    const allRows = response.data.values;
    if (!allRows) {
      return;
    }

    const targetId = enrollmentId.toString();
    let rowIndex = -1;

    for (let i = 0; i < allRows.length; i++) {
      if (allRows[i][1] === targetId) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex !== -1) {
      const rowNumber = rowIndex + 1;
      const updateRange = `Enrollments!L${rowNumber}:M${rowNumber}`;

      await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[status, adminRemarks || '']],
        },
      });

      console.log('Enrollment status updated in Google Sheet');
    }
  } catch (error) {
    console.error(
      'Failed to update enrollment in Google Sheet:',
      error.message
    );
  }
}

export async function addDemoBookingToSheet(booking, userEmail) {
  if (!spreadsheetId || !serviceEmail) {
    console.log('Google Sheets not configured, skipping...');
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('en-IN');
    const bookingId = booking._id.toString();
    const formattedDate = new Date(booking.preferredDate).toLocaleDateString('en-IN');

    const rowData = [
      [timestamp, bookingId, booking.name, booking.phone, userEmail || '', formattedDate, booking.preferredTime, booking.status || 'pending'],
    ];

    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'DemoBookings!A:H',
      valueInputOption: 'USER_ENTERED',
      resource: { values: rowData },
    });

    console.log('Demo booking added to Google Sheet:', booking.name);
  } catch (error) {
    console.error('Failed to add demo booking to Google Sheet:', error.message);
  }
}
