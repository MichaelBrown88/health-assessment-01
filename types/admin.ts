export interface Admin {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AdminModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string | number;
}
