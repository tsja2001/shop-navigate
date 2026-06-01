const { contextBridge, ipcRenderer } = require('electron');

// 暴露给 React 本地 fallback 使用（兼容保留）
contextBridge.exposeInMainWorld('electronAPI', {
  quit: (password) => ipcRenderer.invoke('request-quit', password),
});

// ── 在任意页面注入退出按钮和密码弹窗（远程/本地 URL 均生效）──────────────────
window.addEventListener('DOMContentLoaded', () => {
  // 防重复注入（SPA 路由跳转等场景）
  if (document.getElementById('__kiosk_exit_btn__')) return;

  const PASSWORD_LENGTH = 6;
  let input = '';

  // ── 样式 ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #__kiosk_exit_btn__ {
      position: fixed !important;
      top: 9px !important;
      right: 14px !important;
      z-index: 2147483647 !important;
      width: 32px !important;
      height: 32px !important;
      border: none !important;
      border-radius: 8px !important;
      background: rgba(0,0,0,0.08) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #6b7a88 !important;
      padding: 0 !important;
      touch-action: manipulation !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      box-sizing: border-box !important;
    }
    #__kiosk_exit_btn__:active {
      background: rgba(0,0,0,0.16) !important;
    }
    #__kiosk_overlay__ {
      display: none;
      position: fixed !important;
      top: 0 !important; left: 0 !important;
      right: 0 !important; bottom: 0 !important;
      z-index: 2147483646 !important;
      background: rgba(0,0,0,0.55) !important;
      align-items: center !important;
      justify-content: center !important;
    }
    #__kiosk_overlay__.kiosk-visible {
      display: flex !important;
    }
    #__kiosk_modal__ {
      background: #fff !important;
      border-radius: 20px !important;
      padding: 36px 28px 28px !important;
      width: 340px !important;
      box-shadow: 0 24px 64px rgba(0,0,0,0.28) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      box-sizing: border-box !important;
    }
    #__kiosk_title__ {
      font-size: 19px !important;
      font-weight: 600 !important;
      color: #1f2d3d !important;
      margin: 0 0 28px !important;
      letter-spacing: 0.5px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    #__kiosk_dots__ {
      display: flex !important;
      gap: 14px !important;
      margin-bottom: 6px !important;
    }
    .kiosk-dot {
      width: 18px !important;
      height: 18px !important;
      border-radius: 50% !important;
      border: 2px solid #c8d4e0 !important;
      background: transparent !important;
      transition: background 0.12s, border-color 0.12s !important;
      display: inline-block !important;
      box-sizing: border-box !important;
    }
    .kiosk-dot.kiosk-filled {
      background: #1677ff !important;
      border-color: #1677ff !important;
    }
    #__kiosk_error_line__ {
      height: 24px !important;
      margin: 8px 0 4px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 14px !important;
      color: #d9534f !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    #__kiosk_keypad__ {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 10px !important;
      width: 100% !important;
      margin-top: 12px !important;
    }
    .kiosk-key {
      height: 76px !important;
      border: none !important;
      border-radius: 14px !important;
      background: #f0f4f8 !important;
      font-size: 24px !important;
      font-weight: 500 !important;
      color: #1f2d3d !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    .kiosk-key:active {
      background: #d4dce8 !important;
      transform: scale(0.96) !important;
    }
    .kiosk-key.kiosk-alt {
      font-size: 17px !important;
      color: #5f6f82 !important;
      background: #e8edf3 !important;
    }
    .kiosk-key.kiosk-alt:active {
      background: #c8d4e0 !important;
    }
    #__kiosk_cancel__ {
      width: 100% !important;
      height: 56px !important;
      margin-top: 18px !important;
      border: 1.5px solid #d0d7e2 !important;
      border-radius: 14px !important;
      background: transparent !important;
      font-size: 17px !important;
      color: #5f6f82 !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
      box-sizing: border-box !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    #__kiosk_cancel__:active {
      background: #f0f4f8 !important;
    }
    @keyframes __kiosk_shake__ {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-10px); }
      40%       { transform: translateX(10px); }
      60%       { transform: translateX(-7px); }
      80%       { transform: translateX(7px); }
    }
    .kiosk-shake {
      animation: __kiosk_shake__ 0.45s ease-in-out !important;
    }
  `;
  document.head.appendChild(style);

  // ── 退出按钮 ───────────────────────────────────────────────────────────────
  const exitBtn = document.createElement('button');
  exitBtn.id = '__kiosk_exit_btn__';
  exitBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
    <line x1="12" y1="2" x2="12" y2="12"/>
  </svg>`;
  document.body.appendChild(exitBtn);

  // ── 弹窗 overlay ───────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = '__kiosk_overlay__';

  const modal = document.createElement('div');
  modal.id = '__kiosk_modal__';

  const title = document.createElement('div');
  title.id = '__kiosk_title__';
  title.textContent = '请输入退出密码';
  modal.appendChild(title);

  // 圆点指示
  const dotsEl = document.createElement('div');
  dotsEl.id = '__kiosk_dots__';
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    const dot = document.createElement('span');
    dot.className = 'kiosk-dot';
    dotsEl.appendChild(dot);
  }
  modal.appendChild(dotsEl);

  // 错误提示
  const errorLine = document.createElement('div');
  errorLine.id = '__kiosk_error_line__';
  modal.appendChild(errorLine);

  // 数字键盘
  const keypad = document.createElement('div');
  keypad.id = '__kiosk_keypad__';
  ['1','2','3','4','5','6','7','8','9','clear','0','del'].forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'kiosk-key' + (key === 'clear' || key === 'del' ? ' kiosk-alt' : '');
    btn.textContent = key === 'clear' ? '清除' : key === 'del' ? '⌫' : key;
    btn.dataset.key = key;
    keypad.appendChild(btn);
  });
  modal.appendChild(keypad);

  // 取消按钮
  const cancelBtn = document.createElement('button');
  cancelBtn.id = '__kiosk_cancel__';
  cancelBtn.textContent = '取消';
  modal.appendChild(cancelBtn);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // ── 逻辑 ───────────────────────────────────────────────────────────────────
  function updateDots() {
    dotsEl.querySelectorAll('.kiosk-dot').forEach((dot, i) => {
      dot.classList.toggle('kiosk-filled', i < input.length);
    });
  }

  function showError(msg) {
    input = '';
    updateDots();
    errorLine.textContent = msg;
    dotsEl.classList.add('kiosk-shake');
    dotsEl.addEventListener('animationend', () => dotsEl.classList.remove('kiosk-shake'), { once: true });
  }

  function openModal() {
    input = '';
    errorLine.textContent = '';
    updateDots();
    overlay.classList.add('kiosk-visible');
  }

  function closeModal() {
    overlay.classList.remove('kiosk-visible');
    input = '';
  }

  async function handleKey(key) {
    if (key === 'clear') { input = ''; errorLine.textContent = ''; updateDots(); return; }
    if (key === 'del')   { input = input.slice(0, -1); errorLine.textContent = ''; updateDots(); return; }
    if (input.length >= PASSWORD_LENGTH) return;

    input += key;
    updateDots();

    if (input.length === PASSWORD_LENGTH) {
      const ok = await ipcRenderer.invoke('request-quit', input);
      if (!ok) showError('密码错误');
    }
  }

  exitBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.kiosk-key');
    if (btn) handleKey(btn.dataset.key);
  });
});
