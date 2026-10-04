/**
 * Student Dashboard View Component
 * Displays student info, live clock, attendance action CTA, history table & attendance % gauge.
 */

let clockInterval = null;

function renderStudentDashboardView() {
  const current = window.AppStorage.getCurrentStudent();
  if (!current) {
    setTimeout(() => AppRouter.navigate('student-login'), 100);
    return `<div class="p-8 text-center text-slate-500">Redirecting to login...</div>`;
  }

  const history = window.AppStorage.getStudentHistory(current.studentId);
  const attendancePct = window.AppStorage.getStudentAttendancePercentage(current.studentId);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = window.AppStorage.checkDuplicateAttendance(current.studentId, todayStr);

  // Setup live clock updating
  setTimeout(() => {
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateLiveClock, 1000);
    updateLiveClock();
  }, 50);

  return `
    <div class="space-y-8 pb-12">
      <!-- Welcome Header -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Student Portal
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">
            Welcome, ${current.name}
          </h1>
          <p class="text-slate-500 text-sm">Manage daily hostel attendance verification</p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex-1 md:flex-initial text-center md:text-right">
            <div class="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Live Time</div>
            <div id="live-time-display" class="text-lg font-bold text-indigo-950 font-mono">--:--:-- --</div>
            <div id="live-date-display" class="text-xs text-indigo-700 font-medium">----------------</div>
          </div>
        </div>
      </div>

      <!-- Student Profile Information Card -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs text-slate-500 font-medium mb-1">Student ID</div>
          <div class="text-base font-bold text-slate-900 font-mono">${current.studentId}</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs text-slate-500 font-medium mb-1">Hostel Block</div>
          <div class="text-base font-bold text-slate-900">${current.hostelBlock}</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs text-slate-500 font-medium mb-1">Room Number</div>
          <div class="text-base font-bold text-slate-900">${current.roomNumber}</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs text-slate-500 font-medium mb-1">Attendance Rating</div>
          <div class="text-base font-bold ${attendancePct >= 75 ? 'text-emerald-600' : 'text-amber-600'}">
            ${attendancePct}% Present
          </div>
        </div>
      </div>

      <!-- Mark Today's Attendance CTA Section -->
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-indigo-100">
              Daily Action
            </span>
            <h2 class="text-2xl md:text-3xl font-bold">Hostel Daily Attendance</h2>
            <p class="text-indigo-100 text-sm max-w-xl">
              Complete 2-step verification: Scan Hostel QR code and capture face photo verification.
            </p>
          </div>

          ${todayRecord ? `
            <div class="w-full md:w-auto p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1">
              <div class="inline-flex items-center gap-1.5 text-emerald-300 font-bold text-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Already Marked Today
              </div>
              <div class="text-xs text-white/80">ID: ${todayRecord.attendanceId} (${todayRecord.time})</div>
            </div>
          ` : `
            <button onclick="AppRouter.navigate('mark-attendance')" class="w-full md:w-auto px-8 py-5 rounded-2xl bg-white text-blue-700 hover:bg-slate-50 font-extrabold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
              Scan QR Code
            </button>
          `}
        </div>

        <!-- Workflow Step Progress Indicator -->
        <div class="pt-4 border-t border-white/10">
          <div class="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">Workflow Steps</div>
          <div class="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div class="p-2 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center text-[10px]">1</span>
              Step 1: QR Verification
            </div>
            <div class="p-2 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center text-[10px]">2</span>
              Step 2: Face Capture
            </div>
            <div class="p-2 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-emerald-400 text-slate-900 font-bold flex items-center justify-center text-[10px]">3</span>
              Step 3: Submitted
            </div>
          </div>
        </div>
      </div>

      <!-- Student Attendance History -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            My Attendance History
          </h2>
          <span class="text-xs text-slate-500 font-medium">${history.length} Record(s)</span>
        </div>

        ${history.length === 0 ? `
          <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-sm">
            No previous attendance records found. Click "Mark Today's Attendance" to add your first entry.
          </div>
        ` : `
          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left border-collapse text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-3.5">Attendance ID</th>
                  <th class="p-3.5">Date</th>
                  <th class="p-3.5">Time</th>
                  <th class="p-3.5">QR Status</th>
                  <th class="p-3.5">Face Status</th>
                  <th class="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${history.map(r => `
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-3.5 font-mono font-bold text-slate-800">${r.attendanceId}</td>
                    <td class="p-3.5 font-medium text-slate-700">${r.date}</td>
                    <td class="p-3.5 text-slate-600">${r.time}</td>
                    <td class="p-3.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Verified ✓
                      </span>
                    </td>
                    <td class="p-3.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Captured ✓
                      </span>
                    </td>
                    <td class="p-3.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                        Present ✓
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;
}

function updateLiveClock() {
  const elTime = document.getElementById('live-time-display');
  const elDate = document.getElementById('live-date-display');
  if (!elTime || !elDate) return;
  const now = new Date();
  elTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  elDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

window.StudentDashboardView = {
  render: renderStudentDashboardView
};
