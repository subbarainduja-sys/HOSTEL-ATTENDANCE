/**
 * LocalStorage Data Management & Persistence Module
 * Manages student data, attendance records, session state, analytics, and duplicate checks.
 */

const STORAGE_KEYS = {
  RECORDS: 'hostel_attendance_records',
  STUDENTS: 'hostel_students',
  ACTIVE_SESSION: 'hostel_active_qr_session',
  CURRENT_STUDENT: 'hostel_current_student',
  IS_ADMIN: 'hostel_is_admin_logged_in',
  TOTAL_STUDENT_CAPACITY: 'hostel_total_capacity'
};

// Standard sample students data
const INITIAL_STUDENTS = [
  { studentId: 'ECE001', name: 'Priya', hostelBlock: 'A Block', roomNumber: '101' },
  { studentId: 'ECE002', name: 'Anjali', hostelBlock: 'A Block', roomNumber: '102' },
  { studentId: 'ECE003', name: 'Kavya', hostelBlock: 'B Block', roomNumber: '201' },
  { studentId: 'ECE004', name: 'Rahul', hostelBlock: 'B Block', roomNumber: '202' },
  { studentId: 'ECE005', name: 'Sai', hostelBlock: 'C Block', roomNumber: '301' },
  { studentId: 'ECE006', name: 'Harsha', hostelBlock: 'C Block', roomNumber: '302' },
  { studentId: 'ECE007', name: 'Teja', hostelBlock: 'A Block', roomNumber: '103' },
  { studentId: 'ECE008', name: 'Sneha', hostelBlock: 'B Block', roomNumber: '203' }
];

// Seed initial records for demonstration if none exist
function seedSampleDataIfNeeded() {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      const today = new Date().toISOString().split('T')[0];
      const sampleRecords = [
        {
          attendanceId: 'ATT-20261004-001',
          studentId: 'ECE001',
          studentName: 'Priya',
          hostelBlock: 'A Block',
          roomNumber: '101',
          date: today,
          time: '08:15 AM',
          qrVerified: true,
          faceCaptured: true,
          status: 'Present'
        },
        {
          attendanceId: 'ATT-20261004-002',
          studentId: 'ECE002',
          studentName: 'Anjali',
          hostelBlock: 'A Block',
          roomNumber: '102',
          date: today,
          time: '08:20 AM',
          qrVerified: true,
          faceCaptured: true,
          status: 'Present'
        },
        {
          attendanceId: 'ATT-20261004-003',
          studentId: 'ECE003',
          studentName: 'Kavya',
          hostelBlock: 'B Block',
          roomNumber: '201',
          date: today,
          time: '08:28 AM',
          qrVerified: true,
          faceCaptured: true,
          status: 'Present'
        },
        {
          attendanceId: 'ATT-20261004-004',
          studentId: 'ECE004',
          studentName: 'Rahul',
          hostelBlock: 'B Block',
          roomNumber: '202',
          date: today,
          time: '08:35 AM',
          qrVerified: true,
          faceCaptured: true,
          status: 'Present'
        },
        {
          attendanceId: 'ATT-20261004-005',
          studentId: 'ECE005',
          studentName: 'Sai',
          hostelBlock: 'C Block',
          roomNumber: '301',
          date: today,
          time: '08:42 AM',
          qrVerified: true,
          faceCaptured: true,
          status: 'Present'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(sampleRecords));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TOTAL_STUDENT_CAPACITY)) {
      localStorage.setItem(STORAGE_KEYS.TOTAL_STUDENT_CAPACITY, '50');
    }
  } catch (err) {
    console.error('LocalStorage initialization error:', err);
  }
}

// Get all attendance records
function getAttendanceRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error fetching records from LocalStorage:', err);
    return [];
  }
}

// Check for duplicate attendance on a specific date for a student
function checkDuplicateAttendance(studentId, dateStr) {
  const records = getAttendanceRecords();
  const existing = records.find(
    r => r.studentId.toUpperCase() === studentId.toUpperCase() && r.date === dateStr
  );
  return existing || null;
}

// Save a new attendance record
function saveAttendanceRecord(recordData) {
  const records = getAttendanceRecords();
  
  // Format current date and timestamp
  const dateObj = new Date();
  const dateStr = recordData.date || dateObj.toISOString().split('T')[0];
  const timeStr = recordData.time || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  // Check for duplicate
  const duplicate = checkDuplicateAttendance(recordData.studentId, dateStr);
  if (duplicate) {
    return {
      success: false,
      isDuplicate: true,
      existingRecord: duplicate,
      message: 'Attendance has already been marked for today.'
    };
  }

  // Generate unique Attendance ID (ATT-YYYYMMDD-XXX)
  const dateCompact = dateStr.replace(/-/g, '');
  const seqNumber = String(records.length + 1).padStart(3, '0');
  const attendanceId = `ATT-${dateCompact}-${seqNumber}`;

  const newRecord = {
    attendanceId,
    studentId: recordData.studentId.toUpperCase(),
    studentName: recordData.studentName,
    hostelBlock: recordData.hostelBlock,
    roomNumber: recordData.roomNumber,
    date: dateStr,
    time: timeStr,
    qrVerified: recordData.qrVerified ?? true,
    faceCaptured: recordData.faceCaptured ?? true,
    status: 'Present',
    photoData: recordData.photoData || null,
    timestamp: Date.now()
  };

  records.unshift(newRecord); // add newest first
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));

  // Also ensure student is saved in roster if new
  saveStudentToRoster({
    studentId: newRecord.studentId,
    name: newRecord.studentName,
    hostelBlock: newRecord.hostelBlock,
    roomNumber: newRecord.roomNumber
  });

  return {
    success: true,
    record: newRecord
  };
}

// Save or update student in roster
function saveStudentToRoster(studentInfo) {
  try {
    const students = getStudents();
    const idx = students.findIndex(s => s.studentId.toUpperCase() === studentInfo.studentId.toUpperCase());
    if (idx >= 0) {
      students[idx] = { ...students[idx], ...studentInfo };
    } else {
      students.push(studentInfo);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving student to roster:', err);
  }
}

// Get all registered sample students
function getStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch (err) {
    return INITIAL_STUDENTS;
  }
}

// Get history records for a specific student
function getStudentHistory(studentId) {
  if (!studentId) return [];
  const records = getAttendanceRecords();
  return records.filter(r => r.studentId.toUpperCase() === studentId.toUpperCase());
}

// Calculate attendance percentage for a student
function getStudentAttendancePercentage(studentId) {
  const history = getStudentHistory(studentId);
  if (history.length === 0) return 100; // default for new student demo
  const presentCount = history.filter(r => r.status === 'Present').length;
  // Calculate based on days since starting or last 30 days
  const totalDays = Math.max(history.length, 1);
  return Math.round((presentCount / totalDays) * 100);
}

// Get Admin Analytics
function getAdminStats(targetDate = null) {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const records = getAttendanceRecords();
  
  const recordsToday = records.filter(r => r.date === dateStr && r.status === 'Present');
  const presentToday = recordsToday.length;

  const totalCapacity = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_STUDENT_CAPACITY) || '50', 10);
  const absentToday = Math.max(0, totalCapacity - presentToday);
  const attendancePercentage = totalCapacity > 0 ? Math.round((presentToday / totalCapacity) * 100) : 0;

  return {
    date: dateStr,
    totalStudents: totalCapacity,
    presentToday,
    absentToday,
    attendancePercentage
  };
}

// Active QR Session Management
function getActiveQRSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!raw) {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const defaultSession = {
        type: "HOSTEL_ATTENDANCE",
        sessionId: `SESS_${Date.now()}`,
        hostelBlock: "A Block",
        date: today,
        createdAt: nowTime,
        validUntil: "11:59 PM"
      };
      defaultSession.payload = JSON.stringify(defaultSession);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(defaultSession));
      return defaultSession;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.payload) {
      parsed.payload = JSON.stringify(parsed);
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

function setActiveQRSession(sessionInfo) {
  try {
    if (typeof sessionInfo === 'object') {
      sessionInfo.type = "HOSTEL_ATTENDANCE";
      sessionInfo.payload = JSON.stringify({
        type: sessionInfo.type,
        sessionId: sessionInfo.sessionId,
        hostelBlock: sessionInfo.hostelBlock,
        date: sessionInfo.date,
        createdAt: sessionInfo.createdAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        validUntil: sessionInfo.validUntil || '11:59 PM'
      });
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionInfo));
  } catch (err) {
    console.error('Error setting active QR session:', err);
  }
}

function validateScannedQRData(rawScannedString) {
  if (!rawScannedString) {
    return {
      isValid: false,
      reason: 'EMPTY',
      message: 'Invalid QR Code. Please scan the Hostel Attendance QR generated by the administrator.'
    };
  }

  let parsed = null;
  try {
    parsed = JSON.parse(rawScannedString);
  } catch (e) {
    if (typeof rawScannedString === 'string' && rawScannedString.includes('HOSTEL_ATTENDANCE')) {
      parsed = { type: 'HOSTEL_ATTENDANCE', date: new Date().toISOString().split('T')[0] };
    }
  }

  if (!parsed || parsed.type !== 'HOSTEL_ATTENDANCE') {
    return {
      isValid: false,
      reason: 'INVALID_TYPE',
      message: 'Invalid QR Code. Please scan the Hostel Attendance QR generated by the administrator.'
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (parsed.date && parsed.date < todayStr) {
    return {
      isValid: false,
      reason: 'EXPIRED',
      message: 'QR Code Expired. Please scan the latest attendance QR generated by the administrator.'
    };
  }

  return {
    isValid: true,
    session: parsed
  };
}

// Current Logged-in User Session Management
function getCurrentStudent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function setCurrentStudent(studentObj) {
  try {
    if (studentObj) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(studentObj));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    }
  } catch (err) {
    console.error('Error saving current student:', err);
  }
}

function isAdminLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
}

function setAdminLoggedIn(isLoggedIn) {
  if (isLoggedIn) {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  }
}

function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  seedSampleDataIfNeeded();
}

// Auto seed on file load
seedSampleDataIfNeeded();

// Export as globally accessible Storage API
window.AppStorage = {
  getAttendanceRecords,
  checkDuplicateAttendance,
  saveAttendanceRecord,
  getStudents,
  saveStudentToRoster,
  getStudentHistory,
  getStudentAttendancePercentage,
  getAdminStats,
  getActiveQRSession,
  setActiveQRSession,
  validateScannedQRData,
  getCurrentStudent,
  setCurrentStudent,
  isAdminLoggedIn,
  setAdminLoggedIn,
  resetAllData,
  INITIAL_STUDENTS
};
