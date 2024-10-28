'use client';

import React from 'react'

interface ColorPickerProps {
  label?: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div className="color-picker">
      <label>{label}</label>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
