import React, { useState } from 'react';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { Settings, ToggleLeft, ToggleRight, Save, RotateCcw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { requireCaptcha } = useCaptcha();
  const { showToast, triggerPopup } = usePopup();

  const [invertAll, setInvertAll] = useState(false);
  const [popupFrequency, setPopupFrequency] = useState('Aggressive');
  const [darkChaosMode, setDarkChaosMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSaveSettings = () => {
    sounds.playDing();
    requireCaptcha('Save Confusing Configurations', () => {
      showToast('⚙️ Settings saved. Or maybe reverted. Who knows?', 'info');
      if (invertAll) {
        document.body.classList.toggle('invert-chaos-filter');
      }
    });
  };

  const handleReset = () => {
    sounds.playBoing();
    triggerPopup({
      title: 'ARE YOU REALLY SURE YOU WANT TO RESET?',
      subtitle: 'ALL YOUR DELIBERATE SUFFERING WILL BE ERASED',
      body: 'Resetting settings may cause the website to temporarily look slightly less broken. This is considered a critical regression.',
      type: 'confirm',
      closeType: 'double-negative',
    });
  };

  return (
    <div className="settings-view-container">
      <div className="settings-header-box">
        <Settings size={28} className="settings-icon" />
        <div>
          <h2>CHAOS SETTINGS & USER REGRETS</h2>
          <p>“Fine-tune your suffering with precision controls.”</p>
        </div>
      </div>

      <div className="settings-card-body">
        {/* Toggle 1 */}
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Invert Entire Viewport (CSS Upside Down / Invert)</span>
            <small className="setting-desc">Flips the entire browser window to test your spatial orientation.</small>
          </div>
          <button
            className={`toggle-switch-btn ${invertAll ? 'toggle-on' : ''}`}
            onClick={() => { sounds.playKeypress(); setInvertAll(prev => !prev); }}
          >
            {invertAll ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            <span>{invertAll ? 'ACTIVE CHAOS' : 'OFF'}</span>
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Popup Spawning Velocity</span>
            <small className="setting-desc">Controls how relentlessly popups demand your emotional validation.</small>
          </div>
          <select
            value={popupFrequency}
            onChange={e => { sounds.playKeypress(); setPopupFrequency(e.target.value); }}
            className="cursed-select-field"
          >
            <option value="Aggressive">Aggressive (Every 20 seconds)</option>
            <option value="Merciless">Merciless (Every 5 seconds)</option>
            <option value="Continuous">Continuous Cascading Popups</option>
            <option value="Subtle">Subtle (Still terrible)</option>
          </select>
        </div>

        {/* Toggle 3 */}
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Dark Chaos Visual Theme</span>
            <small className="setting-desc">Replaces neon pink with fluorescent lime green and eye-straining yellow.</small>
          </div>
          <button
            className={`toggle-switch-btn ${darkChaosMode ? 'toggle-on' : ''}`}
            onClick={() => { sounds.playKeypress(); setDarkChaosMode(prev => !prev); }}
          >
            {darkChaosMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            <span>{darkChaosMode ? 'MAX STRAIN' : 'DEFAULT HELL'}</span>
          </button>
        </div>

        {/* Toggle 4 */}
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Audio Synthesizer Sound Effects</span>
            <small className="setting-desc">Web Audio synthesized boings, buzzers, and retro clicks.</small>
          </div>
          <button
            className={`toggle-switch-btn ${soundEnabled ? 'toggle-on' : ''}`}
            onClick={() => { sounds.playKeypress(); setSoundEnabled(prev => !prev); }}
          >
            {soundEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            <span>{soundEnabled ? 'LOUD' : 'MUTED'}</span>
          </button>
        </div>

        <div className="settings-actions-bar">
          <button className="settings-save-btn" onClick={handleSaveSettings}>
            <Save size={16} /> SAVE & PROCEED
          </button>

          <button className="settings-reset-btn" onClick={handleReset}>
            <RotateCcw size={16} /> RESET TO FACTORY CHAOS
          </button>
        </div>
      </div>
    </div>
  );
};
