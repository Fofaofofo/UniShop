'use client';
import { useRouter } from 'next/navigation';
import LandingOnboarding from '@/components/LandingOnboarding';

export default function LandingPage() {
  const router = useRouter();

  const handleFinish = () => {
    try {
      localStorage.setItem('unishop_onboarding_completed', 'true');
    } catch {}
    router.push('/');
  };

  return <LandingOnboarding onFinish={handleFinish} isStandalone={true} />;
}

