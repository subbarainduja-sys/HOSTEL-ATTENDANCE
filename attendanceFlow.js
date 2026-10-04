/**
 * 3-Step Attendance Marking Wizard View Component
 * Handles Step 1 (Real Camera QR Scanner / Invalid QR Check / Demo QR fallback),
 * Step 2 (Face Photo Capture / Demo Face), and Step 3 (Attendance Details Confirmation).
 */

let flowState = {
  step: 1, // 1: QR, 2: Face, 3: Confirm, 4: Success
  qrVerified: false,
  faceCaptured: false,
  photoData: null,
  finalRecord: null,
  errorMessage: null,
  invalidQRMessage: null,
  permissionDenied: false,
  detectedQRMessage: null,
  scannedSession: null
};

function renderAttendanceFlowView() {
  const current = window.AppStorage.getCurrentStudent();
  if (!current) {
    setTimeout(() => AppRouter.navigate('student-login'), 100);
    return `<div class="p-8 text-center text-slate-500">Redirecting to login...</div>`;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const duplicate = window.AppStorage.checkDuplicateAttendance(current.studentId, todayStr);

  // Prevent Duplicate Attendance Check
  if (duplicate && flowState.step !== 4) {
    return `
      <div class="max-w-lg mx-auto py-8">
        <div class="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl space-y-6 text-center">
          <div class="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold text-2xl">
            ⚠️
          </div>
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-slate-900">Attendance Already Marked</h2>
            <p class="text-slate-600 text-sm">
              Attendance has already been recorded for today (<span class="font-semibold">${todayStr}</span>).
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700">
            <div class="flex justify-between">
              <span class="text-slate-500">Attendance ID:</span>
              <span class="font-mono font-bold text-slate-900">${duplicate.attendanceId}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Student Name:</span>
              <span class="font-bold text-slate-900">${duplicate.studentName} (${duplicate.studentId})</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Marked Time:</span>
              <span class="font-medium text-slate-900">${duplicate.time}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Hostel Block:</span>
              <span class="font-medium text-slate-900">${duplicate.hostelBlock} - Room ${duplicate.roomNumber}</span>
            </div>
          </div>

          <button onclick="AppRouter.navigate('student-dashboard')" class="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-base shadow-md hover:bg-blue-500 transition-all">
            Back to Dashboard
          </button>
        </div>
      </div>
    `;
  }

  // Lifecycle hooks for step camera initializations
  setTimeout(() => {
    if (flowState.step === 1 && !flowState.qrVerified && !flowState.permissionDenied) {
      initQRStep();
    } else if (flowState.step === 2 && !flowState.faceCaptured && !flowState.photoData) {
      initFaceStep();
    }
  }, 100);

  return `
    <div class="max-w-2xl mx-auto space-y-6 pb-12">
      <!-- Progress Bar Indicator -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>Step ${flowState.step} of 3</span>
          <span>${getStepTitle(flowState.step)}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="h-2 rounded-full ${flowState.step >= 1 ? 'bg-blue-600' : 'bg-slate-200'} transition-all"></div>
          <div class="h-2 rounded-full ${flowState.step >= 2 ? 'bg-blue-600' : 'bg-slate-200'} transition-all"></div>
          <div class="h-2 rounded-full ${flowState.step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'} transition-all"></div>
        </div>
      </div>

      <!-- Step Body Render -->
      ${renderStepBody(current)}
    </div>
  `;
}

function getStepTitle(step) {
  if (step === 1) return 'Scan Attendance QR';
  if (step === 2) return 'Face Capture';
  if (step === 3) return 'Attendance Details Confirmation';
  return 'Marked Successfully';
}

function renderStepBody(current) {
  if (flowState.step === 1) {
    return `
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-slate-900">Scan Attendance QR</h2>
          <p class="text-xs text-slate-500">Point your camera at the attendance QR code displayed by administration.</p>
        </div>

        <!-- Camera Scanner Viewfinder -->
        <div id="qr-camera-container" class="relative w-full max-w-xs sm:max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-inner flex items-center justify-center">
          <video id="qr-video" class="w-full h-full object-cover"></video>
          <canvas id="qr-canvas" class="hidden"></canvas>
          
          <!-- Viewfinder Frame Box -->
          <div class="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/80 m-8 sm:m-10 rounded-xl flex items-center justify-center">
            <div class="w-full h-0.5 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse"></div>
          </div>

          <div id="qr-status-overlay" class="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
            Scanning for Hostel QR...
          </div>
        </div>

        <!-- Detected Success State -->
        ${flowState.qrVerified ? `
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold space-y-1 text-center">
            <div class="text-emerald-700">✓ QR Code Detected</div>
            <div class="text-emerald-700">✓ Attendance Session Verified</div>
            <div class="text-emerald-600 font-extrabold text-base pt-1">QR Verification Successful ✓</div>
          </div>
        ` : ''}

        <!-- Invalid / Expired QR Alert -->
        ${flowState.invalidQRMessage ? `
          <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-1 text-left">
            <div class="font-bold text-rose-900 text-sm">Invalid QR Code</div>
            <div>${flowState.invalidQRMessage}</div>
          </div>
        ` : ''}

        <!-- Camera Permission Denied Modal -->
        ${flowState.permissionDenied ? `
          <div class="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3 text-left">
            <div class="font-bold text-sm text-amber-950">Camera Permission Required</div>
            <p class="text-amber-800">Camera permission is required to scan the attendance QR.</p>
            <div class="flex gap-3 pt-1">
              <button onclick="AttendanceFlowView.retryQRScanner()" class="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all">
                Try Again
              </button>
              <button onclick="AttendanceFlowView.triggerDemoQR()" class="flex-1 py-3 rounded-xl bg-white hover:bg-slate-50 text-amber-900 border border-amber-300 font-bold text-xs transition-all">
                Use Demo QR
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Scanner Controls -->
        ${!flowState.qrVerified ? `
          <div class="pt-2 space-y-3">
            <button onclick="AttendanceFlowView.stopCameraManual()" class="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
              [ Stop Camera ]
            </button>
            <div class="pt-2 border-t border-slate-100">
              <button onclick="AttendanceFlowView.triggerDemoQR()" class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                Use Demo QR Verification
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (flowState.step === 2) {
    return `
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-slate-900">Face Capture</h2>
          <p class="text-xs text-slate-500">Position your face inside the camera frame and capture your photo.</p>
        </div>

        <div class="relative w-full max-w-xs mx-auto aspect-square rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center">
          ${flowState.photoData ? `
            <img src="${flowState.photoData}" class="w-full h-full object-cover" />
          ` : `
            <video id="face-video" class="w-full h-full object-cover"></video>
            <canvas id="face-canvas" class="hidden"></canvas>
            
            <!-- Oval Face Target Frame Overlay -->
            <div class="absolute inset-0 pointer-events-none border-4 border-emerald-400/80 rounded-[50%] m-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
          `}
        </div>

        ${flowState.errorMessage ? `
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium space-y-2">
            <div>${flowState.errorMessage}</div>
          </div>
        ` : ''}

        ${flowState.photoData ? `
          <div class="space-y-4">
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              Face Photo Captured ✓
            </div>
            <div class="flex gap-3">
              <button onclick="AttendanceFlowView.retakePhoto()" class="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all">
                Retake
              </button>
              <button onclick="AttendanceFlowView.confirmPhoto()" class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all">
                Use This Photo
              </button>
            </div>
          </div>
        ` : `
          <div class="space-y-3 pt-2">
            <button onclick="AttendanceFlowView.capturePhotoFromStream()" class="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Capture Photo
            </button>
            
            <button onclick="AttendanceFlowView.triggerDemoFace()" class="w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Demo Face Capture
            </button>
          </div>
        `}
      </div>
    `;
  }

  if (flowState.step === 3) {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6">
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-bold text-slate-900">Attendance Details</h2>
          <p class="text-xs text-slate-500">Review your attendance parameters before final submission</p>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          ${flowState.photoData ? `
            <img src="${flowState.photoData}" class="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm" />
          ` : `
            <div class="w-28 h-28 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-xs">No Photo</div>
          `}

          <div class="flex-1 space-y-2 text-sm text-slate-800 w-full">
            <div class="flex justify-between border-b border-slate-200 pb-1">
              <span class="text-slate-500">Student Name:</span>
              <span class="font-bold text-slate-900">${current.name}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-1">
              <span class="text-slate-500">Student ID:</span>
              <span class="font-mono font-bold text-slate-900">${current.studentId}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-1">
              <span class="text-slate-500">Hostel Block / Room:</span>
              <span class="font-medium text-slate-900">${current.hostelBlock} / Room ${current.roomNumber}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 pb-1">
              <span class="text-slate-500">Date & Time:</span>
              <span class="font-medium text-slate-900">${todayStr} (${timeStr})</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">QR Verification:</span>
              <span class="text-emerald-600 font-bold">Successful ✓</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Face Capture:</span>
              <span class="text-emerald-600 font-bold">Successful ✓</span>
            </div>
          </div>
        </div>

        <button onclick="AttendanceFlowView.submitAttendance()" class="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          Submit Attendance
        </button>
      </div>
    `;
  }

  if (flowState.step === 4 && flowState.finalRecord) {
    const rec = flowState.finalRecord;
    return `
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold text-3xl">
          ✓
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900">Attendance Marked Successfully ✓</h2>
          <p class="text-xs text-slate-500">Your digital attendance record has been generated and saved.</p>
        </div>

        <div class="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-left space-y-3 font-medium text-sm text-slate-800">
          <div class="flex justify-between border-b border-indigo-100 pb-2">
            <span class="text-slate-500">Attendance ID:</span>
            <span class="font-mono font-extrabold text-blue-700 text-base">${rec.attendanceId}</span>
          </div>
          <div class="flex justify-between border-b border-indigo-100 pb-2">
            <span class="text-slate-500">Student Name:</span>
            <span class="font-bold text-slate-900">${rec.studentName} (${rec.studentId})</span>
          </div>
          <div class="flex justify-between border-b border-indigo-100 pb-2">
            <span class="text-slate-500">Date & Time:</span>
            <span class="font-medium text-slate-900">${rec.date} at ${rec.time}</span>
          </div>
          <div class="flex justify-between border-b border-indigo-100 pb-2">
            <span class="text-slate-500">Hostel Block:</span>
            <span class="font-medium text-slate-900">${rec.hostelBlock} - Room ${rec.roomNumber}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="text-slate-500">Attendance Status:</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs">Present ✓</span>
          </div>
        </div>

        <button onclick="AttendanceFlowView.resetAndBack()" class="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg transition-all">
          Back to Dashboard
        </button>
      </div>
    `;
  }
}

// Controller Actions
function initQRStep() {
  const vEl = document.getElementById('qr-video');
  const cEl = document.getElementById('qr-canvas');
  if (!vEl) return;

  flowState.errorMessage = null;
  flowState.invalidQRMessage = null;
  flowState.permissionDenied = false;

  window.QRController.startQRScanner({
    videoElement: vEl,
    canvasElement: cEl,
    onSuccess: (rawPayload, sessionObj) => {
      flowState.qrVerified = true;
      flowState.invalidQRMessage = null;
      flowState.errorMessage = null;
      flowState.scannedSession = sessionObj;
      window.QRController.stopQRScanner();
      AppRouter.render();
      setTimeout(() => {
        flowState.step = 2;
        AppRouter.render();
      }, 1400);
    },
    onInvalidQR: (errMsg) => {
      flowState.invalidQRMessage = errMsg;
      AppRouter.render();
    },
    onExpiredQR: (errMsg) => {
      flowState.invalidQRMessage = errMsg;
      AppRouter.render();
    },
    onError: (errText) => {
      flowState.permissionDenied = true;
      flowState.errorMessage = errText;
      AppRouter.render();
    }
  });
}

function retryQRScanner() {
  flowState.permissionDenied = false;
  flowState.invalidQRMessage = null;
  flowState.errorMessage = null;
  AppRouter.render();
  setTimeout(() => initQRStep(), 100);
}

function stopCameraManual() {
  window.QRController.stopQRScanner();
  const elStatus = document.getElementById('qr-status-overlay');
  if (elStatus) elStatus.textContent = 'Camera Stopped';
}

function triggerDemoQR() {
  window.QRController.stopQRScanner();
  flowState.qrVerified = true;
  flowState.errorMessage = null;
  flowState.invalidQRMessage = null;
  flowState.permissionDenied = false;
  flowState.step = 2;
  AppRouter.render();
}

function initFaceStep() {
  const vEl = document.getElementById('face-video');
  if (!vEl) return;

  flowState.errorMessage = null;

  window.CameraController.startFaceCamera(vEl, (errText) => {
    flowState.errorMessage = errText;
    AppRouter.render();
  });
}

function capturePhotoFromStream() {
  const vEl = document.getElementById('face-video');
  const cEl = document.getElementById('face-canvas');
  if (vEl && cEl) {
    const photo = window.CameraController.snapPhotoFromVideo(vEl, cEl);
    if (photo) {
      window.CameraController.stopFaceCamera();
      flowState.photoData = photo;
      flowState.faceCaptured = true;
      flowState.errorMessage = null;
      AppRouter.render();
    }
  }
}

function triggerDemoFace(studentName) {
  const current = window.AppStorage.getCurrentStudent();
  const nameToUse = studentName || (current ? current.name : 'Student');
  window.CameraController.stopFaceCamera();
  flowState.photoData = window.CameraController.generateDemoFacePhoto(nameToUse);
  flowState.faceCaptured = true;
  flowState.errorMessage = null;
  AppRouter.render();
}

function retakePhoto() {
  flowState.photoData = null;
  flowState.faceCaptured = false;
  AppRouter.render();
}

function confirmPhoto() {
  flowState.step = 3;
  AppRouter.render();
}

function submitAttendance() {
  const current = window.AppStorage.getCurrentStudent();
  if (!current) return;

  const result = window.AppStorage.saveAttendanceRecord({
    studentId: current.studentId,
    studentName: current.name,
    hostelBlock: current.hostelBlock,
    roomNumber: current.roomNumber,
    qrVerified: true,
    faceCaptured: true,
    photoData: flowState.photoData
  });

  if (result.success) {
    flowState.finalRecord = result.record;
    flowState.step = 4;
    AppRouter.render();
  } else {
    flowState.errorMessage = result.message;
    AppRouter.render();
  }
}

function resetAndBack() {
  flowState = {
    step: 1,
    qrVerified: false,
    faceCaptured: false,
    photoData: null,
    finalRecord: null,
    errorMessage: null,
    invalidQRMessage: null,
    permissionDenied: false,
    detectedQRMessage: null,
    scannedSession: null
  };
  window.QRController.stopQRScanner();
  window.CameraController.stopFaceCamera();
  AppRouter.navigate('student-dashboard');
}

window.AttendanceFlowView = {
  render: renderAttendanceFlowView,
  retryQRScanner,
  stopCameraManual,
  triggerDemoQR,
  capturePhotoFromStream,
  triggerDemoFace,
  retakePhoto,
  confirmPhoto,
  submitAttendance,
  resetAndBack
};
