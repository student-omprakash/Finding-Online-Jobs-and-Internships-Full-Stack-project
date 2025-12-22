import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={twMerge(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6',
        hoverEffect && 'hover:shadow-md hover:border-primary-200 dark:hover:border-slate-600 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
