'use client';

import CompanyAvatar from '@/components/common/AvatarTrasnform';
import { useApplicantStore } from '@/app/store/authApplicantStore';
import { useUserStore } from '@/app/store/useUserInfoStore';
import {AplicantAvatar} from './AplicantAvatar'

// 👇 AJUSTA: importa tu store de company real
// import { useCompanyStore } from '@/app/store/authCompanyStore';

type Props = { size?: 'sm' | 'md' | 'lg' };

export default function RoleUserBadge({ size = 'sm' }: Props) {
  const { token: applicantToken } = useApplicantStore();
  const { user } = useUserStore();

  // 👇 AJUSTA: detecta company session real
  // const { token: companyToken, company } = useCompanyStore();

  const isApplicant = !!applicantToken;

  if (isApplicant) {
    const fullName =
      (user?.firstName || user?.lastName)
        ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
        : 'Usuario';

    return (
      <div className="flex items-center gap-2">
        <AplicantAvatar firstName={user?.firstName} lastName={user?.lastName} size={size} />
        <span className="truncate max-w-[200px] text-left">{fullName}</span>
      </div>
    );
  }

  // ✅ fallback a company (conecta aquí tu data real)
  // const companyTitle = company?.name ?? 'Empresa';

  const companyTitle = 'Empresa'; // placeholder

  return (
    <div className="flex items-center gap-2">
      <CompanyAvatar companyName={companyTitle} size={size} />
      <span className="truncate max-w-[200px] text-left">{companyTitle}</span>
    </div>
  );
}
