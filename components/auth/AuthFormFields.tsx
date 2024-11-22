interface AuthFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: 'signup' | 'login' | 'admin';
  passwordStrengthScore: number;
}

export function AuthFormFields({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  mode,
  passwordStrengthScore
}: AuthFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={onEmailChange}
          required
          disabled={isLoading}
          className="bg-black/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={onPasswordChange}
          required
          disabled={isLoading}
          className="bg-black/50"
        />
        {mode === 'signup' && (
          <PasswordStrengthIndicator score={passwordStrengthScore} />
        )}
      </div>
    </>
  );
} 