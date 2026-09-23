import { Calendar } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ icon: Icon = Calendar, title, message, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
      <Icon size={32} className="text-primary-400" />
    </div>
    <h3 className="text-xl font-bold text-dark-50 mb-2">{title}</h3>
    <p className="text-dark-400 max-w-xs mb-6">{message}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
