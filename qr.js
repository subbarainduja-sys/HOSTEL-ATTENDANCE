/**
 * Real QR Code Generator & Scanner Controller Module
 * Uses QRCode.js library for standard machine-readable QR generation
 * Uses jsQR library for live camera frame decoding and validation.
 */

let activeVideoTrack = null;
let scanAnimationId = null;

// Render Real Machine-Readable QR Code
function renderQRCode(containerElement, payloadData) {
  if (!containerElement) return;
  containerElement.innerHTML = '';

  const textToEncode = typeof payloadData === 'object' ? JSON.stringify(payloadData) : payloadData;

  if (window.QRCode) {
    try {
      new window.QRCode(containerElement, {
        text: textToEncode || '{"type":"HOSTEL_ATTENDANCE"}',
        width: 240,
        height: 240,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.H : 2
      });
    } catch (e) {
      console.error("QR Code Render Error:", e);
      containerElement.innerHTML = `<div class="p-4 bg-slate-100 rounded-lg text-xs font-mono break-all text-slate-700">${textToEncode}</div>`;
    }
  } else {
    containerElement.innerHTML = `<div class="p-4 bg-slate-100 rounded-lg text-xs font-mono break-all text-slate-700">${textToEncode}</div>`;
  }
}

// Start Camera QR Scanner
async function startQRScanner({ videoElement, canvasElement, onSuccess, onError, onInvalidQR, onExpiredQR }) {
  stopQRScanner();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (onError) onError("Camera permission is required to scan the attendance QR.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } }
    });

    activeVideoTrack = stream;
    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.setAttribute("playsinline", "true");
      await videoElement.play();
    }

    const ctx = canvasElement ? canvasElement.getContext("2d", { willReadFrequently: true }) : null;
    let isDecoded = false;
    let lastInvalidNotifyTime = 0;

    function scanFrame() {
      if (isDecoded || !activeVideoTrack) return;

      if (videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        if (canvasElement && ctx) {
          canvasElement.width = videoElement.videoWidth || 640;
          canvasElement.height = videoElement.videoHeight || 480;
          ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

          const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

          if (window.jsQR) {
            const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert"
            });

            if (code && code.data) {
              const now = Date.now();
              const validation = window.AppStorage.validateScannedQRData(code.data);

              if (validation.isValid) {
                isDecoded = true;
                stopQRScanner();
                if (onSuccess) onSuccess(code.data, validation.session);
                return;
              } else {
                // Throttle invalid notifications so message is stable
                if (now - lastInvalidNotifyTime > 2000) {
                  lastInvalidNotifyTime = now;
                  if (validation.reason === 'EXPIRED') {
                    if (onExpiredQR) onExpiredQR(validation.message);
                  } else {
                    if (onInvalidQR) onInvalidQR(validation.message);
                  }
                }
              }
            }
          }
        }
      }
      scanAnimationId = requestAnimationFrame(scanFrame);
    }

    scanAnimationId = requestAnimationFrame(scanFrame);

  } catch (err) {
    console.warn("QR Camera Permission/Access Error:", err);
    let message = "Camera permission is required to scan the attendance QR.";
    if (onError) onError(message);
  }
}

// Stop Camera Stream
function stopQRScanner() {
  if (scanAnimationId) {
    cancelAnimationFrame(scanAnimationId);
    scanAnimationId = null;
  }
  if (activeVideoTrack) {
    activeVideoTrack.getTracks().forEach(track => track.stop());
    activeVideoTrack = null;
  }
}

window.QRController = {
  renderQRCode,
  startQRScanner,
  stopQRScanner
};
