import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} glass-card shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
          <h2 className="text-lg font-bold text-dark-50">{title}</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors p-1.5 rounded-xl">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 text-dark-200">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
