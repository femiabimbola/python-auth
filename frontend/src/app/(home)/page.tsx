
import { OrbBackground } from '@/app/(home)/_components/OrbBackground/OrbBackground';
import { Navbar } from '@/components/Navbar/Navbar';

import { Hero } from '@/app/(home)/_components/Hero/Hero';

import { DashboardPreview } from '@/app/(home)/_components/DashboardPreview/DashboardPreview';
import { Features } from '@/app/(home)/_components/Features/Features';
import { SocialProof } from '@/app/(home)/_components/SocialProof/SocialProof';

// import { CtaBanner } from '@/components/sections/CtaBanner';
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
        {/* <CtaBanner />    */}
      </main>
       <Footer />
    
    </>
  );
}