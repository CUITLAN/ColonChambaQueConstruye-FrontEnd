import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ApplicantAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  photoUrl?: string | null; // opcional
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function firstLetter(value?: string | null): string {
  if (!value) return '';
  const cleaned = value
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  const match = cleaned.match(/\p{L}/u);
  return match ? match[0].toUpperCase() : '';
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const f = firstLetter(firstName);
  const l = firstLetter(lastName);

  if (f && l) return `${f}${l}`;
  if (f) return f;
  if (l) return l;
  return 'U';
}

const ApplicantAvatar: React.FC<ApplicantAvatarProps> = ({
  firstName,
  lastName,
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const initials = getInitials(firstName, lastName);

  const sizeClasses = {
    sm: 'h-10 w-10 text-base',
    md: 'h-[60px] w-[60px] text-xl',
    lg: 'h-20 w-20 text-2xl',
  } as const;

  return (
    <Avatar className={`overflow-hidden ${sizeClasses[size]} ${className}`}>
      <AvatarImage src={photoUrl ?? undefined} alt="Applicant Avatar" />
      <AvatarFallback className={`font-bold bg-brand text-white ${sizeClasses[size]}`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default ApplicantAvatar;
