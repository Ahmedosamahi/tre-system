
import { cn } from '@/lib/utils';
import { StatusBadgeProps } from '@/types';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children, className, title }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const statusClasses = {
    success: 'bg-success-light text-green-800',
    warning: 'bg-warning-light text-yellow-800',
    danger: 'bg-danger-light text-red-800',
    info: 'bg-info-light text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={cn(baseClasses, statusClasses[status], className)} title={title}>
      {children}
    </span>
  );
};

// Also export as default for backward compatibility
export default StatusBadge;
