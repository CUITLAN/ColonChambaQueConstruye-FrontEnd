import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CompanyAvatarProps {
  companyName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  if (!name) return '??';

  const cleanName = name
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\b(?:SA|DE|CV|DEL|LA|EL)\b/gi, '')
    .trim();

  const parts = cleanName.split(/\s+/).filter(p => p.length > 0);

  if (parts.length === 1) return cleanName.substring(0, 2).toUpperCase();
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();

  return '??';
}

const CompanyAvatar: React.FC<CompanyAvatarProps> = ({ companyName, logoUrl, size = 'md' }) => {
  const companyInitials = getInitials(companyName);

  const sizeClasses = {
    sm: 'h-10 w-10 text-base',
    md: 'h-[60px] w-[60px] text-xl',
    lg: 'h-20 w-20 text-2xl',
  } as const;

  return (
    <Avatar className={`mx-auto object-contain ${sizeClasses[size]}`}>
      <AvatarImage src={logoUrl} alt={`${companyName} Logo`} />
      <AvatarFallback className={`font-bold bg-uaq-terniary text-white ${sizeClasses[size]}`}>
        {companyInitials}
      </AvatarFallback>
    </Avatar>
  );
};

export default CompanyAvatar;
