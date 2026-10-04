/**
 * Student Login View Component
 * Provides student details entry form with quick demo selection chips.
 */

function renderStudentLoginView() {
  const current = window.AppStorage.getCurrentStudent() || {};

  return `
    <div class="max-w-md mx-auto py-6 space-y-6">
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center font-bold text-xl mb-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Student Login</h2>
          <p class="text-xs text-slate-500">Enter your hostel details to access attendance dashboard</p>
        </div>

        <!-- Quick Fill Preset Chips for Demo -->
        <div class="space-y-2 pt-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Quick Demo Select:</label>
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="StudentLoginView.fillSample('ECE001', 'Priya', 'A Block', '101')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors">
              Priya (ECE001)
            </button>
            <button type="button" onclick="StudentLoginView.fillSample('ECE002', 'Anjali', 'A Block', '102')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors">
              Anjali (ECE002)
            </button>
            <button type="button" onclick="StudentLoginView.fillSample('ECE003', 'Kavya', 'B Block', '201')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors">
              Kavya (ECE003)
            </button>
            <button type="button" onclick="StudentLoginView.fillSample('ECE004', 'Rahul', 'B Block', '202')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors">
              Rahul (ECE004)
            </button>
          </div>
        </div>

        <form id="student-login-form" onsubmit="StudentLoginView.handleSubmit(event)" class="space-y-4 pt-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Student ID *</label>
            <input 
              type="text" 
              id="student-id" 
              required 
              placeholder="e.g. ECE001" 
              value="${current.studentId || 'ECE001'}"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Student Name *</label>
            <input 
              type="text" 
              id="student-name" 
              required 
              placeholder="e.g. Priya" 
              value="${current.name || 'Priya'}"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Hostel Block *</label>
              <select id="student-block" required class="w-full px-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 outline-none bg-white">
                <option value="A Block" ${current.hostelBlock === 'A Block' ? 'selected' : ''}>A Block</option>
                <option value="B Block" ${current.hostelBlock === 'B Block' ? 'selected' : ''}>B Block</option>
                <option value="C Block" ${current.hostelBlock === 'C Block' ? 'selected' : ''}>C Block</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Room Number *</label>
              <input 
                type="text" 
                id="student-room" 
                required 
                placeholder="e.g. 101" 
                value="${current.roomNumber || '101'}"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div id="login-error-msg" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>

          <button type="submit" class="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]">
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  `;
}

function fillSample(id, name, block, room) {
  const elId = document.getElementById('student-id');
  const elName = document.getElementById('student-name');
  const elBlock = document.getElementById('student-block');
  const elRoom = document.getElementById('student-room');
  if (elId) elId.value = id;
  if (elName) elName.value = name;
  if (elBlock) elBlock.value = block;
  if (elRoom) elRoom.value = room;
}

function handleSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('student-id').value.trim();
  const name = document.getElementById('student-name').value.trim();
  const block = document.getElementById('student-block').value;
  const room = document.getElementById('student-room').value.trim();

  if (!id || !name || !block || !room) {
    const errEl = document.getElementById('login-error-msg');
    errEl.textContent = 'Please fill in all student details.';
    errEl.classList.remove('hidden');
    return;
  }

  const studentObj = { studentId: id, name, hostelBlock: block, roomNumber: room };
  window.AppStorage.setCurrentStudent(studentObj);
  window.AppStorage.saveStudentToRoster(studentObj);

  AppRouter.navigate('student-dashboard');
}

window.StudentLoginView = {
  render: renderStudentLoginView,
  fillSample,
  handleSubmit
};
