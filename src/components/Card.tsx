import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};