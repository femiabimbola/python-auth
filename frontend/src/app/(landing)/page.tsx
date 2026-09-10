
import { OrbBackground } from '@/components/OrbBackground/OrbBackground';
import { Navbar } from '@/components/Navbar/Navbar';

import { Hero } from '@/app/(landing)/_components/Hero/Hero';

import { DashboardPreview } from '@/app/(landing)/_components/DashboardPreview/DashboardPreview';
import { Features } from '@/app/(landing)/_components/Features/Features';
import { SocialProof } from '@/app/(landing)/_components/SocialProof/SocialProof';


import { Footer } from '@/components/Footer/Footer';

export default function HomePage() {
  return (
    <>
      <OrbBackground />
     <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
         <Features />
        <SocialProof />
      </main>
      <Footer />
    
    </>
  );
}