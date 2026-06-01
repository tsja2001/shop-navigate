import { useState, useCallback } from 'react';
import Style from './ExitModal.module.css';

const PASSWORD_LENGTH = 6;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];

export default function ExitModal({ onClose }) {
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shaking, setShaking] = useState(false);

  const triggerError = useCallback((msg) => {
    setInput('');
    setErrorMsg(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const handleKey = useCallback(async (key) => {
    if (key === 'clear') {
      setInput('');
      setErrorMsg('');
      return;
    }
    if (key === 'del') {
      setInput(prev => prev.slice(0, -1));
      setErrorMsg('');
      return;
    }

    if (input.length >= PASSWORD_LENGTH) return;
    const next = input + key;
    setInput(next);

    if (next.length === PASSWORD_LENGTH) {
      if (!window.electronAPI) {
        triggerError('密码错误');
        return;
      }
      const ok = await window.electronAPI.quit(next);
      if (!ok) {
        triggerError('密码错误');
      }
    }
  }, [input, triggerError]);

  return (
    <div className={Style.overlay} onClick={onClose}>
      <div className={Style.modal} onClick={e => e.stopPropagation()}>
        <div className={Style.title}>请输入退出密码</div>

        <div className={`${Style.dots} ${shaking ? Style.shake : ''}`}>
          {Array.from({ length: PASSWORD_LENGTH }).map((_, i) => (
            <span key={i} className={`${Style.dot} ${i < input.length ? Style.dotFilled : ''}`} />
          ))}
        </div>

        <div className={Style.errorLine}>
          {errorMsg && <span className={Style.error}>{errorMsg}</span>}
        </div>

        <div className={Style.keypad}>
          {KEYS.map(key => (
            <button
              key={key}
              className={`${Style.key} ${key === 'clear' || key === 'del' ? Style.keyAlt : ''}`}
              onClick={() => handleKey(key)}
            >
              {key === 'clear' ? '清除' : key === 'del' ? '⌫' : key}
            </button>
          ))}
        </div>

        <button className={Style.cancelBtn} onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}
