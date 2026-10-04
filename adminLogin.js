/**
 * Admin Login View Component
 * Simple admin authentication screen (admin / admin123).
 */

function renderAdminLoginView() {
  return `
    <div class="max-w-md mx-auto py-8 space-y-6">
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center font-bold text-xl mb-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Admin Login</h2>
          <p class="text-xs text-slate-500">Hostel Administration Portal</p>
        </div>

        <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-medium space-y-1">
          <div class="font-bold">Demo Login Credentials:</div>
          <div>Username: <code class="font-bold bg-white px-1.5 py-0.5 rounded border">admin</code></div>
          <div>Password: <code class="font-bold bg-white px-1.5 py-0.5 rounded border">admin123</code></div>
        </div>

        <form id="admin-login-form" onsubmit="AdminLoginView.handleSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Username *</label>
            <input 
              type="text" 
              id="admin-username" 
              required 
              value="admin"
              placeholder="Username" 
              class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-800 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Password *</label>
            <input 
              type="password" 
              id="admin-password" 
              required 
              value="admin123"
              placeholder="Password" 
              class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-800 outline-none transition-all"
            />
          </div>

          <div id="admin-error-msg" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>

          <button type="submit" class="w-full py-4 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-base shadow-lg shadow-indigo-700/30 transition-all active:scale-[0.98]">
            Login to Admin Portal
          </button>
        </form>
      </div>
    </div>
  `;
}

function handleSubmit(event) {
  event.preventDefault();
  const u = document.getElementById('admin-username').value.trim();
  const p = document.getElementById('admin-password').value.trim();

  if (u === 'admin' && p === 'admin123') {
    window.AppStorage.setAdminLoggedIn(true);
    AppRouter.navigate('admin-dashboard');
  } else {
    const errEl = document.getElementById('admin-error-msg');
    errEl.textContent = 'Invalid Admin credentials. Use admin / admin123.';
    errEl.classList.remove('hidden');
  }
}

window.AdminLoginView = {
  render: renderAdminLoginView,
  handleSubmit
};
