'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicantStore } from '../store/authApplicantStore'; 
import { useUserStore } from '../store/useUserInfoStore';

interface ApplicantLayoutProps {
  children: React.ReactNode;
}

export default function ApplicantLayout({ children }: ApplicantLayoutProps) {
  const router = useRouter();

  const {token,id:userId, initialize} = useApplicantStore();
  const {fetchUserData}=useUserStore()
  const [isInitialized, setIsInitialized] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const boot = async () => {
    await initialize();     // importante
    setIsInitialized(true);
  };
  boot();
}, [initialize]);


  useEffect(() => {
    if (isInitialized) {
      if (!token) {
        router.push('/login/applicant'); 
        
      } 
      setIsLoading(false);
      
    }
  }, [token, isInitialized, router]);

  useEffect(()=>{
    if(!isInitialized)return
    if(!token||!userId)return

    fetchUserData(userId,token)
  },[isInitialized,token,userId,fetchUserData])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen text-lg text-gray-600'>
        Cargando. Verificando sesión...
      </div>
    );
  }

  if (token) {
      return <>{children}</>;
  }

  return null; 
}