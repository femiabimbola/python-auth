
// import { OrbBackground } from '@/components/OrbBackground/OrbBackground';
// import { Navbar } from '@/components/Navbar/Navbar';
import { NavHeader } from './_components/Navbar';
import { HeroSection } from './_components/Hero';

import { Hero } from '@/app/(landing)/_components/HeroOld/Hero';

import { DashboardPreview } from '@/app/(landing)/_components/DashboardPreview/DashboardPreview';
import { Features } from '@/app/(landing)/_components/Features/Features';
import { SocialProof } from '@/app/(landing)/_components/SocialProof/SocialProof';


import { Footer } from '@/components/Footer/Footer';

export default function HomePage() {
  return (
    <>
      {/* <OrbBackground /> */}
     {/* <Navbar /> */}
     <NavHeader />
      <main>
        <HeroSection />
        {/* <Hero /> */}
        {/* <DashboardPreview /> */}
         {/* <Features /> */}
        {/* <SocialProof /> */}
      </main>
      <Footer />
    
    </>
  );
}