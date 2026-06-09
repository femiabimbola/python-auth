
import { OrbBackground } from '@/components/OrbBackground/OrbBackground';
import { Navbar } from '@/components/Navbar/Navbar';

import { Hero } from '@/components/Hero/Hero';

import { DashboardPreview } from '@/components/DashboardPreview/DashboardPreview';
import { Features } from '@/components/Features/Features';
import { SocialProof } from '@/components/SocialProof/SocialProof';

// import { CtaBanner } from '@/components/sections/CtaBanner';
// import { Footer } from '@/components/sections/Footer';
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