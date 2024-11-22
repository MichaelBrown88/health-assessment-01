interface PasswordStrengthProps {
  score: number;
}

export function PasswordStrengthIndicator({ score }: PasswordStrengthProps) {
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-700 rounded-full">
        <div 
          className="h-1 bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all"
          style={{ width: `${score * 25}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Password strength: {strengthLabels[Math.min(score - 1, 3)]}
      </p>
    </div>
  );
} 