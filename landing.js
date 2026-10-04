/**
 * Landing Page View Component
 * Displays project title, workflow overview, 3 feature cards, how it works, advantages, limitations & navigation options.
 */

function renderLandingView() {
  return `
    <div class="space-y-12 pb-12">
      <!-- Hero Section -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 md:p-14 shadow-2xl">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase text-indigo-200">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ECE College Project Demo System
          </div>
          
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hostel Attendance System
          </h1>
          
          <p class="text-xl md:text-2xl font-medium text-indigo-200">
            Smartphone-Based QR & Face Capture Attendance
          </p>
          
          <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            “An automated hostel attendance system that uses QR-based verification and smartphone camera capture to simplify daily student attendance.”
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button onclick="AppRouter.navigate('student-login')" class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Student Login
            </button>
            <button onclick="AppRouter.navigate('admin-login')" class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Admin Login
            </button>
          </div>
        </div>
      </section>

      <!-- 3 Key Feature Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">1. QR-Based Attendance</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Instant smartphone QR scanning validates active hostel location and attendance session parameters securely.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">2. Face Capture</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Smartphone front-camera photo capture attaches visual verification records for hostel warden monitoring.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">3. Digital Records</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Automated LocalStorage log management, duplicate entry protection, and instant downloadable CSV reports.
          </p>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900">How It Works</h2>
          <p class="text-slate-600">Simple 4-step daily attendance workflow for students and wardens.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">1</div>
            <h4 class="font-bold text-slate-900">Student Login</h4>
            <p class="text-slate-600 text-xs leading-relaxed">Student enters their Student ID, Name, Hostel Block, and Room Number.</p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">2</div>
            <h4 class="font-bold text-slate-900">QR Verification</h4>
            <p class="text-slate-600 text-xs leading-relaxed">Student scans the active daily attendance QR code displayed in the hostel.</p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">3</div>
            <h4 class="font-bold text-slate-900">Face Capture</h4>
            <p class="text-slate-600 text-xs leading-relaxed">Smartphone camera captures a clear face photo record for identity log verification.</p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">4</div>
            <h4 class="font-bold text-slate-900">Attendance Recorded</h4>
            <p class="text-slate-600 text-xs leading-relaxed">Unique Attendance ID generated and stored in digital records accessible to administration.</p>
          </div>
        </div>
      </section>

      <!-- Advantages Section -->
      <section class="bg-indigo-50/60 rounded-2xl p-8 border border-indigo-100 space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 text-center">Advantages of the System</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Reduces manual attendance register paperwork</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Faster daily attendance marking process</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Smartphone friendly mobile-first design</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">QR-based session & location verification</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Face/photo record capture verification</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Digital attendance log & analytics</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Easy monitoring by hostel administration</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Prevents duplicate attendance entries</span>
          </div>
          <div class="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-indigo-50">
            <div class="text-emerald-500 font-bold">✓</div>
            <span class="text-sm text-slate-700 font-medium">Generates downloadable CSV reports for Excel</span>
          </div>
        </div>
      </section>

      <!-- Project Prototype Limitations -->
      <section class="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
        <div class="flex items-center gap-2 text-amber-900 font-bold">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Current Prototype Limitations (College Review Transparency)
        </div>
        <ul class="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
          <li>Uses client-side LocalStorage instead of a production cloud database.</li>
          <li>Face capture is demonstrated using smartphone camera photo record capture rather than full AI biometric neural recognition.</li>
          <li>Authentication is simplified for academic project review.</li>
          <li>A production release would require secure backend server authentication, encrypted database storage, and strict biometric privacy compliance.</li>
        </ul>
      </section>
    </div>
  `;
}

window.LandingView = { render: renderLandingView };
