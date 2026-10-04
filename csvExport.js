/**
 * CSV Export Utility Module
 * Converts LocalStorage attendance records into a downloadable Excel-compatible CSV file.
 */

function downloadAttendanceCSV(recordsFilter = null) {
  const records = recordsFilter || window.AppStorage.getAttendanceRecords();

  if (!records || records.length === 0) {
    alert('No attendance records available to export.');
    return;
  }

  // Header titles
  const headers = [
    'Attendance ID',
    'Student ID',
    'Student Name',
    'Hostel Block',
    'Room Number',
    'Date',
    'Time',
    'QR Verification',
    'Face Capture',
    'Attendance Status'
  ];

  // Map rows
  const rows = records.map(r => [
    r.attendanceId || '',
    r.studentId || '',
    r.studentName || '',
    r.hostelBlock || '',
    r.roomNumber || '',
    r.date || '',
    r.time || '',
    r.qrVerified ? 'Verified' : 'Pending',
    r.faceCaptured ? 'Captured' : 'Pending',
    r.status || 'Present'
  ]);

  // Construct CSV content with escaping
  let csvContent = '\uFEFF'; // Add UTF-8 BOM so Excel displays non-ASCII correctly
  csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

  rows.forEach(row => {
    const escapedRow = row.map(cell => {
      const val = String(cell).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
    csvContent += escapedRow + '\n';
  });

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `Hostel_Attendance_Report_${todayStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

window.CSVExporter = {
  downloadAttendanceCSV
};
