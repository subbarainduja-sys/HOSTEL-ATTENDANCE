/**
 * Admin Dashboard View Component
 * Provides analytics cards, QR Code Generator, searchable/filterable attendance table, and CSV report downloads.
 */

let filterState = {
  searchQuery: '',
  blockFilter: 'ALL',
  dateFilter: ''
};

function renderAdminDashboardView() {
  if (!window.AppStorage.isAdminLoggedIn()) {
    setTimeout(() => AppRouter.navigate('admin-login'), 100);
    return `<div class="p-8 text-center text-slate-500">Redirecting to admin login...</div>`;
  }

  const stats = window.AppStorage.getAdminStats(filterState.dateFilter || null);
  const activeSession = window.AppStorage.getActiveQRSession();
  const allRecords = window.AppStorage.getAttendanceRecords();

  // Filter records
  const filteredRecords = allRecords.filter(r => {
    const matchesSearch = !filterState.searchQuery || 
      r.studentName.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(filterState.searchQuery.toLowerCase());
    
    const matchesBlock = filterState.blockFilter === 'ALL' || r.hostelBlock === filterState.blockFilter;
    const matchesDate = !filterState.dateFilter || r.date === filterState.dateFilter;

    return matchesSearch && matchesBlock && matchesDate;
  });

  // Render QR Code after DOM load
  setTimeout(() => {
    const qrContainer = document.getElementById('admin-qr-code-box');
    if (qrContainer && activeSession) {
      window.QRController.renderQRCode(qrContainer, activeSession.payload);
    }
  }, 100);

  return `
    <div class="space-y-8 pb-16">
      <!-- Admin Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Hostel Administration Portal
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Admin Dashboard</h1>
          <p class="text-slate-500 text-xs md:text-sm">Real-time hostel attendance monitoring & QR session management</p>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="CSVExporter.downloadAttendanceCSV()" class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download CSV Report
          </button>
        </div>
      </div>

      <!-- 4 Dynamic Metric Cards -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</div>
          <div class="text-3xl font-extrabold text-slate-900 mt-2">${stats.totalStudents}</div>
          <div class="text-[11px] text-slate-400 mt-1">Configured Capacity</div>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Present Today</div>
          <div class="text-3xl font-extrabold text-emerald-600 mt-2">${stats.presentToday}</div>
          <div class="text-[11px] text-emerald-700 mt-1">Verified Records</div>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs font-bold text-rose-500 uppercase tracking-wider">Absent Today</div>
          <div class="text-3xl font-extrabold text-rose-600 mt-2">${stats.absentToday}</div>
          <div class="text-[11px] text-rose-500 mt-1">Pending Attendance</div>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Attendance Rate</div>
          <div class="text-3xl font-extrabold text-indigo-600 mt-2">${stats.attendancePercentage}%</div>
          <div class="text-[11px] text-indigo-500 mt-1">Daily Percentage</div>
        </div>
      </section>

      <!-- Generate Attendance QR Panel -->
      <section class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
              Generate Attendance QR Code
            </h2>
            <p class="text-xs text-slate-500">Create an active QR code session for students to scan during hostel roll call.</p>
          </div>

          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            QR Status: Active
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <form onsubmit="AdminDashboardView.handleGenerateQR(event)" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Hostel Block</label>
                  <select id="qr-block" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="ALL">All Blocks</option>
                    <option value="A Block">A Block</option>
                    <option value="B Block">B Block</option>
                    <option value="C Block">C Block</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Attendance Date</label>
                  <input type="date" id="qr-date" value="${activeSession ? activeSession.date : new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Valid Until</label>
                  <input type="text" id="qr-validity" value="11:59 PM" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div class="flex gap-3">
                <button type="submit" class="flex-1 py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all">
                  Generate QR
                </button>
                <button type="button" onclick="AdminDashboardView.handleGenerateQR(event)" class="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all">
                  Generate New QR
                </button>
              </div>
            </form>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
              <div class="font-bold text-slate-900 flex items-center justify-between">
                <span>Session Metadata</span>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">QR Status: ACTIVE</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div><span class="text-slate-400">Session ID:</span> <strong class="text-indigo-700">${activeSession ? activeSession.sessionId : 'SESS_ACTIVE'}</strong></div>
                <div><span class="text-slate-400">Block:</span> <strong class="text-slate-800">${activeSession ? (activeSession.hostelBlock || activeSession.block) : 'A Block'}</strong></div>
                <div><span class="text-slate-400">Date:</span> <strong class="text-slate-800">${activeSession ? activeSession.date : new Date().toISOString().split('T')[0]}</strong></div>
                <div><span class="text-slate-400">Valid Until:</span> <strong class="text-slate-800">${activeSession ? activeSession.validUntil : '11:59 PM'}</strong></div>
              </div>
            </div>
          </div>

          <!-- Display Scannable QR -->
          <div class="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <div id="admin-qr-code-box" class="p-4 bg-white rounded-2xl shadow-lg border border-slate-200"></div>
            <div class="text-xs text-slate-600 font-bold">Machine-Readable Attendance QR Code</div>
            <p class="text-[11px] text-slate-400">Scan this code using student smartphone camera or live scanner</p>
          </div>
        </div>
      </section>

      <!-- Attendance Records Table Section -->
      <section class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Attendance Records</h2>
            <p class="text-xs text-slate-500">Live attendance updates stored in LocalStorage</p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value="${filterState.searchQuery}"
              oninput="AdminDashboardView.updateSearch(this.value)"
              class="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none w-44"
            />

            <select onchange="AdminDashboardView.updateBlockFilter(this.value)" class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="ALL" ${filterState.blockFilter === 'ALL' ? 'selected' : ''}>All Blocks</option>
              <option value="A Block" ${filterState.blockFilter === 'A Block' ? 'selected' : ''}>A Block</option>
              <option value="B Block" ${filterState.blockFilter === 'B Block' ? 'selected' : ''}>B Block</option>
              <option value="C Block" ${filterState.blockFilter === 'C Block' ? 'selected' : ''}>C Block</option>
            </select>

            <input 
              type="date" 
              value="${filterState.dateFilter}"
              onchange="AdminDashboardView.updateDateFilter(this.value)"
              class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button onclick="AdminDashboardView.clearFilters()" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left border-collapse text-xs md:text-sm">
            <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th class="p-3.5">Attendance ID</th>
                <th class="p-3.5">Student ID</th>
                <th class="p-3.5">Student Name</th>
                <th class="p-3.5">Block</th>
                <th class="p-3.5">Room</th>
                <th class="p-3.5">Date</th>
                <th class="p-3.5">Time</th>
                <th class="p-3.5">QR Status</th>
                <th class="p-3.5">Face Status</th>
                <th class="p-3.5">Attendance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              ${filteredRecords.length === 0 ? `
                <tr>
                  <td colspan="10" class="p-8 text-center text-slate-400">No attendance records matching filter criteria.</td>
                </tr>
              ` : filteredRecords.map(r => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="p-3.5 font-mono font-bold text-indigo-900">${r.attendanceId}</td>
                  <td class="p-3.5 font-mono font-bold text-slate-800">${r.studentId}</td>
                  <td class="p-3.5 font-bold text-slate-900">${r.studentName}</td>
                  <td class="p-3.5 text-slate-700">${r.hostelBlock}</td>
                  <td class="p-3.5 text-slate-700">${r.roomNumber}</td>
                  <td class="p-3.5 text-slate-600">${r.date}</td>
                  <td class="p-3.5 text-slate-600">${r.time}</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Verified ✓</span>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Captured ✓</span>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">Present ✓</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

// Controller logic
function handleGenerateQR(e) {
  if (e && e.preventDefault) e.preventDefault();

  const blockEl = document.getElementById('qr-block');
  const dateEl = document.getElementById('qr-date');
  const validEl = document.getElementById('qr-validity');

  const block = blockEl ? blockEl.value : 'A Block';
  const date = dateEl ? dateEl.value : new Date().toISOString().split('T')[0];
  const valid = validEl ? validEl.value : '11:59 PM';
  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newSession = {
    type: "HOSTEL_ATTENDANCE",
    sessionId: `SESS_${Date.now()}`,
    hostelBlock: block,
    date: date,
    createdAt: nowTime,
    validUntil: valid
  };

  window.AppStorage.setActiveQRSession(newSession);
  AppRouter.render();
}

function updateSearch(q) {
  filterState.searchQuery = q;
  AppRouter.render();
}

function updateBlockFilter(b) {
  filterState.blockFilter = b;
  AppRouter.render();
}

function updateDateFilter(d) {
  filterState.dateFilter = d;
  AppRouter.render();
}

function clearFilters() {
  filterState = { searchQuery: '', blockFilter: 'ALL', dateFilter: '' };
  AppRouter.render();
}

window.AdminDashboardView = {
  render: renderAdminDashboardView,
  handleGenerateQR,
  updateSearch,
  updateBlockFilter,
  updateDateFilter,
  clearFilters
};
