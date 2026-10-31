
// import { OrbBackground } from '@/components/OrbBackground/OrbBackground';

import { NavHeader } from './_components/Navbar';
import { HeroSection } from './_components/Hero';
import { CategorySection } from './_components/Category';
import { FeaturedJobs } from './_components/FeatureJob';
import { HowItWorks } from './_components/HowItWorks';
import { HiringCTA } from './_components/CTA';
import { Footer } from './_components/Footer';

import { Hero } from '@/app/(landing)/_components/HeroOld/Hero';

import { DashboardPreview } from '@/app/(landing)/_components/DashboardPreview/DashboardPreview';
import { Features } from '@/app/(landing)/_components/Features/Features';
import { SocialProof } from '@/app/(landing)/_components/SocialProof/SocialProof';



export default function HomePage() {
  return (
    <>
     <NavHeader />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedJobs />
        <HowItWorks />
        <HiringCTA />
      </main>
      <Footer />
    
    </>
  );
}