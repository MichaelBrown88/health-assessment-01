'use client';

import React from 'react'

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, children }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {children}
  </select>
);

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const SelectValue: React.FC<{ placeholder: string }> = ({ placeholder }) => <span>{placeholder}</span>;

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);
