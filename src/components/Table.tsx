import React, { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 -mx-4 sm:mx-0">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
      <tr>{children}</tr>
    </thead>
  );
};

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {children}
    </tbody>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-5 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
};

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, className = '' }) => {
  return (
    <th className={`px-3 sm:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};