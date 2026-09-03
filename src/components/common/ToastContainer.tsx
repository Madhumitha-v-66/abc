import React from 'react';
import { usePopup } from '../../context/PopupContext';
import { X, AlertTriangle, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePopup();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-portal-root">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'warning': return <AlertTriangle size={18} className="toast-icon-warn" />;
            case 'error': return <AlertTriangle size={18} className="toast-icon-error" />;
            default: return <Bell size={18} className="toast-icon-info" />;
          }
        };

        const getPosClass = () => {
          switch (toast.position) {
            case 'top-left': return 'toast-pos-top-left';
            case 'bottom-right': return 'toast-pos-bottom-right';
            case 'center-left': return 'toast-pos-center-left';
            default: return 'toast-pos-bottom-right';
          }
        };

        return (
          <div key={toast.id} className={`cursed-toast ${getPosClass()} toast-${toast.type}`}>
            <div className="toast-header">
              {getIcon()}
              <span className="toast-title">NOTIFICATION #{(Math.random() * 8888).toFixed(0)}</span>
              <button
                className="toast-close-btn"
                onClick={() => dismissToast(toast.id)}
                title="Try to close (good luck)"
              >
                <X size={12} />
              </button>
            </div>
            <div className="toast-body">
              {toast.message}
            </div>
            <div className="toast-footer-bar">
              <span className="toast-subtext">Sent 0.1s ago by Autonomous Notification Engine</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
