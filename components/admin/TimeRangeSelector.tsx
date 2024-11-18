interface TimeRangeSelectorProps {
    value: 'week' | 'month' | 'year';
    onChange: (value: 'week' | 'month' | 'year') => void;
  }
  
  export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
    return (
      <div className="flex space-x-2">
        {['week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => onChange(range as 'week' | 'month' | 'year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${value === range 
                ? 'bg-black/30 backdrop-blur-sm border-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
    );
  }