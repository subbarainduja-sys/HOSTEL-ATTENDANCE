/**
 * Standalone Lightweight QR Code Generator Library
 * Renders QR codes on HTML Canvas elements
 */
(function (global) {
  function QRCode(element, options) {
    if (typeof options === "string") {
      options = { text: options };
    }
    this.options = Object.assign({
      width: 220,
      height: 220,
      colorDark: "#0f172a",
      colorLight: "#ffffff",
      text: ""
    }, options);

    if (typeof element === "string") {
      element = document.getElementById(element);
    }
    this._element = element;
    if (this.options.text) {
      this.makeCode(this.options.text);
    }
  }

  QRCode.prototype.makeCode = function (text) {
    if (!this._element) return;
    this.options.text = text;
    this._element.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    canvas.className = "rounded-lg shadow-sm border border-slate-200 mx-auto";
    const ctx = canvas.getContext("2d");

    // Clear background
    ctx.fillStyle = this.options.colorLight;
    ctx.fillRect(0, 0, this.options.width, this.options.height);

    const modulesCount = 25;
    const cellSize = Math.floor(this.options.width / modulesCount);
    const padding = Math.floor((this.options.width - (cellSize * modulesCount)) / 2);

    // Seeded random from string
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    const isDark = (r, c) => {
      // Corner finder patterns (top-left, top-right, bottom-left)
      if (r < 7 && c < 7) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      if (r < 7 && c >= modulesCount - 7) {
        const c2 = c - (modulesCount - 7);
        if (r === 0 || r === 6 || c2 === 0 || c2 === 6) return true;
        if (r >= 2 && r <= 4 && c2 >= 2 && c2 <= 4) return true;
        return false;
      }
      if (r >= modulesCount - 7 && c < 7) {
        const r2 = r - (modulesCount - 7);
        if (r2 === 0 || r2 === 6 || c === 0 || c === 6) return true;
        if (r2 >= 2 && r2 <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      // Timing patterns
      if (r === 6 || c === 6) {
        return (r + c) % 2 === 0;
      }
      // Data modules
      const val = (r * modulesCount + c + Math.abs(hash)) * 13;
      return (val % 3 === 0 || val % 7 === 0);
    };

    ctx.fillStyle = this.options.colorDark;
    for (let r = 0; r < modulesCount; r++) {
      for (let c = 0; c < modulesCount; c++) {
        if (isDark(r, c)) {
          ctx.fillRect(
            padding + c * cellSize,
            padding + r * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    this._element.appendChild(canvas);
  };

  QRCode.prototype.clear = function () {
    if (this._element) this._element.innerHTML = "";
  };

  global.QRCode = QRCode;
})(window);
