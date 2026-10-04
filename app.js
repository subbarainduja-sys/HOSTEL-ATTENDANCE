/**
 * Main Application Router & Lifecycle Controller
 * Manages view routing, navigation bar state, demo mode toggle, and toast notifications.
 */

const AppRouter = {
  currentRoute: 'landing',

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  },

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'landing';
    this.currentRoute = hash;
    this.render();
  },

  navigate(route) {
    window.location.hash = route;
  },

  render() {
    const container = document.getElementById('app-content');
    if (!container) return;

    this.updateNavbar();

    switch (this.currentRoute) {
      case 'landing':
        container.innerHTML = window.LandingView.render();
        break;

      case 'student-login':
        container.innerHTML = window.StudentLoginView.render();
        break;

      case 'student-dashboard':
        container.innerHTML = window.StudentDashboardView.render();
        break;

      case 'mark-attendance':
        container.innerHTML = window.AttendanceFlowView.render();
        break;

      case 'admin-login':
        container.innerHTML = window.AdminLoginView.render();
        break;

      case 'admin-dashboard':
        container.innerHTML = window.AdminDashboardView.render();
        break;

      default:
        container.innerHTML = window.LandingView.render();
        break;
    }

    // Scroll back to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateNavbar() {
    const navContainer = document.getElementById('navbar-links');
    if (!navContainer) return;

    const currentStudent = window.AppStorage.getCurrentStudent();
    const isAdmin = window.AppStorage.isAdminLoggedIn();

    if (isAdmin) {
      navContainer.innerHTML = `
        <button onclick="AppRouter.navigate('admin-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${this.currentRoute === 'admin-dashboard' ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600 hover:text-slate-900'}">
          Admin Dashboard
        </button>
        <button onclick="CSVExporter.downloadAttendanceCSV()" class="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200">
          Reports (CSV)
        </button>
        <button onclick="AppRouter.logoutAdmin()" class="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50">
          Logout
        </button>
      `;
    } else if (currentStudent) {
      navContainer.innerHTML = `
        <button onclick="AppRouter.navigate('student-dashboard')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${this.currentRoute === 'student-dashboard' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:text-slate-900'}">
          Dashboard
        </button>
        <button onclick="AppRouter.navigate('mark-attendance')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${this.currentRoute === 'mark-attendance' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}">
          Mark Attendance
        </button>
        <button onclick="AppRouter.logoutStudent()" class="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50">
          Logout
        </button>
      `;
    } else {
      navContainer.innerHTML = `
        <button onclick="AppRouter.navigate('student-login')" class="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50">
          Student Login
        </button>
        <button onclick="AppRouter.navigate('admin-login')" class="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-50">
          Admin Login
        </button>
      `;
    }
  },

  logoutStudent() {
    window.AppStorage.setCurrentStudent(null);
    this.navigate('landing');
  },

  logoutAdmin() {
    window.AppStorage.setAdminLoggedIn(false);
    this.navigate('landing');
  }
};

window.AppRouter = AppRouter;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  AppRouter.init();
});
