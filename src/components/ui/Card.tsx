
import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types';

export const Card = ({ title, className, children, action }: CardProps) => {
  return (
    <div className={cn('bg-white p-5 rounded-lg shadow-sm border border-gray-100', className)}>
      {title && (
        <div className="card-title-wrapper">
          <h3 className="card-title">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
