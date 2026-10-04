/**
 * Face Capture & Camera Manager Module
 * Manages front camera photo capture, preview, retake options, and fallback demo avatar generation.
 */

let activeCameraStream = null;

// Start camera stream for face capture
async function startFaceCamera(videoElement, onError) {
  stopFaceCamera();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (onError) onError("Camera API is not supported in this browser. Please use Demo Face Capture.");
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 640 }
      },
      audio: false
    });

    activeCameraStream = stream;
    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.setAttribute("playsinline", "true");
      await videoElement.play();
    }
    return true;
  } catch (err) {
    console.warn("Face Camera Error:", err);
    let msg = "Camera permission was denied. Please allow camera access or use Demo Face Capture for project demonstration.";
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      msg = "Camera permission was denied. Please allow camera access or use Demo Face Capture for project demonstration.";
    } else if (err.name === 'NotFoundError') {
      msg = "Camera device not found on this device.";
    }
    if (onError) onError(msg);
    return false;
  }
}

// Stop face camera stream
function stopFaceCamera() {
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(track => track.stop());
    activeCameraStream = null;
  }
}

// Snap photo from video element into Base64 canvas data URL
function snapPhotoFromVideo(videoElement, canvasElement) {
  if (!videoElement || !canvasElement) return null;
  const ctx = canvasElement.getContext('2d');
  const size = Math.min(videoElement.videoWidth || 400, videoElement.videoHeight || 400);
  canvasElement.width = 320;
  canvasElement.height = 320;

  // Center crop square
  const sx = ((videoElement.videoWidth || 400) - size) / 2;
  const sy = ((videoElement.videoHeight || 400) - size) / 2;

  ctx.drawImage(videoElement, sx, sy, size, size, 0, 0, 320, 320);

  // Add timestamp stamp overlay for demo clarity
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(0, 280, 320, 40);
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  const now = new Date();
  ctx.fillText(`VERIFIED PHOTO • ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 160, 305);

  return canvasElement.toDataURL('image/jpeg', 0.85);
}

// Generate Demo Face Photo placeholder for fallback mode
function generateDemoFacePhoto(studentName = 'Student') {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 320, 320);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 320, 320);

  // Draw face outline graphic
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(160, 120, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(160, 260, 90, 0, Math.PI * 2);
  ctx.fill();

  // Draw target circle ring
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(160, 150, 100, 0, Math.PI * 2);
  ctx.stroke();

  // Draw checkmark badge
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(160, 150, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓', 160, 157);

  // Overlay text stamp
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 275, 320, 45);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`DEMO FACE CAPTURE RECORD`, 160, 295);

  ctx.fillStyle = '#ffffff';
  ctx.font = '11px sans-serif';
  ctx.fillText(`${studentName.toUpperCase()} • ${new Date().toLocaleTimeString()}`, 160, 312);

  return canvas.toDataURL('image/jpeg', 0.85);
}

window.CameraController = {
  startFaceCamera,
  stopFaceCamera,
  snapPhotoFromVideo,
  generateDemoFacePhoto
};
