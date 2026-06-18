import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" size={20} color="var(--success)" />;
      case 'error':
        return <XCircle className="toast-icon" size={20} color="var(--danger)" />;
      case 'warning':
        return <AlertTriangle className="toast-icon" size={20} color="var(--warning)" />;
      case 'info':
      default:
        return <Info className="toast-icon" size={20} color="var(--secondary)" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {getIcon(toast.type)}
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close notification">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
