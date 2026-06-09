import React from 'react';
import Link from 'next/link';

// ── MAIN PAGE COMPONENT ───────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative font-sans antialiased">
      {/* Ambient orb background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-18%] left-1/2 -translate-x-1/2 w-[130vw] h-[130vw] max-w-[900px] max-h-[900px] rounded-full ambient-orb" />
      </div>

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <DashboardPreview />
        <Features />
        <SocialProof />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

// ── REUSABLE LOGO COMPONENT ──────────────────────────────────────────
function Logo() {
  return (
    <Link href="#" className="flex items-center gap-2.5 no-underline">
      <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#7C5CFC] to-[#5B3EE8] grid place-items-center">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
          <path d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="2" fill="white" />
        </svg>
      </div>
      <span className="font-serif text-xl font-bold text-[#2D1B69] tracking-tight">Aurum</span>
    </Link>
  );
}

// ── NAVBAR SECTION ───────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 md:px-12 bg-[#FAFAF8]/82 backdrop-blur-[18px] border-b border-[rgba(124,92,252,0.14)]">
      <Logo />
      <ul className="hidden md:flex items-center gap-8 list-none">
        {['Features', 'Security', 'Pricing', 'Docs'].map((link) => (
          <li key={link}>
            <Link href="#" className="text-sm font-medium text-[#6B6080] transition-colors hover:text-[#2D1B69]">
              {link}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <Link href="#" className="text-sm font-medium text-[#2D1B69] px-4 py-2 rounded-log transition-colors hover:bg-[#E8E4FF] rounded-md">
          Sign in
        </Link>
        <Link href="#" className="text-sm font-semibold text-white bg-gradient-to-br from-[#7C5CFC] to-[#5B3EE8] px-5 py-2.5 rounded-md shadow-[0_2px_12px_rgba(124,92,252,0.3)] transition-all hover:opacity-90 hover:shadow-[0_4px_20px_rgba(124,92,252,0.4)]">
          Start free
        </Link>
      </div>
    </nav>
  );
}

// ── HERO SECTION ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
      <div className="inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-widest uppercase text-[#7C5CFC] bg-[#E8E4FF] border border-[rgba(124,92,252,0.14)] px-4 py-1.5 rounded-full mb-9">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8D5BA]" />
        Now in open beta
      </div>
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-[#2D1B69] max-w-[800px] mb-6">
        Identity, handled<br />with <em className="not-italic text-[#7C5CFC]">quiet precision</em>
      </h1>
      <p className="text-lg leading-relaxed text-[#6B6080] max-w-[520px] mb-11">
        Aurum gives your application a complete authentication layer — seamless for your users, robust for your team, invisible at its best.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-18 mb-16">
        <Link href="#" className="text-base font-semibold text-white bg-gradient-to-br from-[#7C5CFC] to-[#5B3EE8] px-8 py-3.5 rounded-xl shadow-[0_4px_24px_rgba(124,92,252,0.35)] transition-all hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(124,92,252,0.45)]">
          Get started free
        </Link>
        <Link href="#" className="text-base font-medium text-[#2D1B69] bg-transparent border-[1.5px] border-[rgba(124,92,252,0.14)] px-7 py-[13px] rounded-xl transition-all hover:border-[#A991FD] hover:bg-[#E8E4FF]">
          See how it works
        </Link>
      </div>
      <div className="flex items-center gap-2.5 text-[0.82rem] text-[#6B6080]">
        <div className="flex">
          <span className="w-7 h-7 rounded-full border-2 border-[#FAFAF8] flex items-center justify-center text-[0.65rem] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#7C5CFC,#5B3EE8)' }}>AK</span>
          <span className="w-7 h-7 rounded-full border-2 border-[#FAFAF8] flex items-center justify-center text-[0.65rem] font-semibold text-white -ml-2" style={{ background: 'linear-gradient(135deg,#A8D5BA,#5BB68A)' }}>MR</span>
          <span className="w-7 h-7 rounded-full border-2 border-[#FAFAF8] flex items-center justify-center text-[0.65rem] font-semibold text-white -ml-2" style={{ background: 'linear-gradient(135deg,#F5A623,#E8812A)' }}>TL</span>
          <span className="w-7 h-7 rounded-full border-2 border-[#FAFAF8] flex items-center justify-center text-[0.65rem] font-semibold text-white -ml-2" style={{ background: 'linear-gradient(135deg,#FC5C7D,#E83E5C)' }}>JO</span>
        </div>
        <span>Trusted by <strong className="text-[#2D1B69] font-semibold">&nbsp;4,200+&nbsp;</strong> developers worldwide</span>
      </div>
    </section>
  );
}

// ── DASHBOARD PREVIEW SECTION ────────────────────────────────────────
function DashboardPreview() {
  const chartHeights = ['40%', '55%', '48%', '62%', '70%', '52%', '88%', '75%', '60%', '92%', '80%', '68%', '100%', '84%'];

  return (
    <div className="max-w-[900px] mx-auto mb-32 px-6">
      <div className="bg-white/82 border border-[rgba(124,92,252,0.14)] rounded-[20px] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_32px_80px_rgba(45,27,105,0.12),0_8px_24px_rgba(124,92,252,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB3AE]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE0A2]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#B5EAC8]" />
          <div className="flex-1 bg-[#F0EEFF] rounded-md h-6 ml-2 flex items-center px-3 text-[0.72rem] text-[#6B6080]">
            app.aurum.io/dashboard
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 min-h-[320px]">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col gap-1.5 bg-gradient-to-b from-[#F0EEFF] to-[#E8E4FF] rounded-xl p-5">
            <div className="text-[0.7rem] font-semibold tracking-wider text-[#6B6080] px-3 pb-2.5 uppercase">Workspace</div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.78rem] font-medium bg-white/70 text-[#2D1B69] shadow-[0_1px_4px_rgba(45,27,105,0.08)]"><span className="w-4 h-4 rounded bg-[#A991FD]" />Overview</div>
            {['Users', 'Sessions', 'Providers', 'Webhooks', 'Logs'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 px-3 py-2 text-[0.78rem] font-medium text-[#6B6080]"><span className="w-4 h-4 rounded bg-[#A991FD]/60" />{item}</div>
            ))}
            <div className="mt-auto">
              <div className="flex items-center gap-2.5 px-3 py-2 text-[0.78rem] font-medium text-[#6B6080]"><span className="w-4 h-4 rounded bg-[#A991FD]/60" />Settings</div>
            </div>
          </div>
          {/* Main panel */}
          <div className="flex flex-col gap-3">
            <div className="font-serif text-[1.1rem] font-semibold text-[#2D1B69] mb-1">Overview — June 2026</div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { val: '12,840', lbl: 'Active users', b: '↑ 8.4%', bg: true },
                { val: '99.98%', lbl: 'Uptime', b: 'Excellent', bg: false },
                { val: '34 ms', lbl: 'Avg. auth time', b: '↓ 12ms', bg: false },
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-[#F0EEFF] border border-[rgba(124,92,252,0.14)] rounded-xl p-3.5">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-[#2D1B69]">{stat.val}</div>
                  <div className="text-[0.7rem] text-[#6B6080] mt-0.5">{stat.lbl}</div>
                  <span className={`inline-block text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${stat.bg ? 'bg-[#A8D5BA]/30 text-[#2E7D52]' : 'bg-[#A8D5BA]/30 text-[#2E7D52]'}`}>
                    {stat.b}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[rgba(124,92,252,0.14)] rounded-xl p-4 flex-1 flex flex-col justify-between">
              <div className="text-[0.72rem] text-[#6B6080] mb-3">Sign-ins — last 14 days</div>
              <div className="flex items-flex-end gap-1.5 h-20 items-end">
                {chartHeights.map((height, idx) => {
                  let opacityClass = 'opacity-25';
                  if ([2, 4, 7, 10, 13].includes(idx)) opacityClass = 'opacity-60';
                  if ([6, 9, 12].includes(idx)) opacityClass = 'opacity-100';

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t bg-gradient-to-t from-[#7C5CFC] to-[#A991FD] ${opacityClass}`}
                      style={{ height }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FEATURES SECTION ─────────────────────────────────────────────────
function Features() {
  const featList = [
    { title: 'Passwordless by default', desc: 'Magic links, passkeys, and biometric auth — designed for the way people actually want to sign in today.', icon: <path d="M7 9V6a3 3 0 016 0v3" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" /> },
    { title: 'Real-time session control', desc: 'Revoke access, enforce MFA, and set adaptive session policies — all reflected immediately, everywhere.', icon: <path d="M10 6v4l2.5 2.5" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> },
    { title: '50+ social providers', desc: 'Google, GitHub, Apple, LinkedIn, and more. One unified API, consistent tokens, predictable behaviour.', icon: <path d="M10 3v10M17 7l-7 4M3 7l7 4" stroke="#7C5CFC" strokeWidth="1.2" opacity="0.4" /> },
    { title: 'Audit logs, built in', desc: 'Every login attempt, MFA event, and permission change is recorded, searchable, and exportable from day one.', icon: <path d="M3 6h14M3 10h9M3 14h5" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" /> },
    { title: 'Roles & permissions', desc: 'Fine-grained RBAC that scales from startup to enterprise — without the overhead of building it yourself.', icon: null },
    { title: 'Fraud & anomaly detection', desc: 'Impossible travel, credential stuffing, and bot detection — silently protecting your users around the clock.', icon: <path d="M10 10V7M10 12v.5" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" /> },
  ];

  return (
    <section className="max-w-[1080px] mx-auto mb-32 px-6">
      <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-[#7C5CFC] mb-3.5">What we offer</div>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1B69] max-w-[500px] mb-15 mb-14">Everything you need. Nothing you don't.</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {featList.map((feat, index) => (
          <div key={index} className="bg-white/70 border border-[rgba(124,92,252,0.14)] rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(45,27,105,0.1)] backdrop-blur-sm">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E8E4FF] to-[#F0EEFF] border border-[rgba(124,92,252,0.14)] grid place-items-center mb-4.5 mb-4">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                {index === 0 && <rect x="4" y="9" width="12" height="9" rx="2" stroke="#7C5CFC" strokeWidth="1.5" />}
                {index === 1 && <circle cx="10" cy="10" r="7" stroke="#7C5CFC" strokeWidth="1.5" />}
                {index === 2 && <path d="M10 3L17 7v6l-7 4-7-4V7l7-4z" stroke="#7C5CFC" strokeWidth="1.5" strokeLinejoin="round" />}
                {index === 4 && (
                  <>
                    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#7C5CFC" strokeWidth="1.5" />
                    <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="#7C5CFC" strokeWidth="1.5" />
                    <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="#7C5CFC" strokeWidth="1.5" />
                    <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="#7C5CFC" strokeWidth="1.5" />
                  </>
                )}
                {index === 5 && <path d="M10 17s-7-4-7-9a7 7 0 1114 0c0 5-7 9-7 9z" stroke="#7C5CFC" strokeWidth="1.5" />}
                {feat.icon}
                {index === 0 && <circle cx="10" cy="13.5" r="1.5" fill="#7C5CFC" />}
              </svg>
            </div>
            <div className="font-serif text-[1.05rem] font-semibold text-[#2D1B69] mb-2.5">{feat.title}</div>
            <div className="text-sm leading-relaxed text-[#6B6080]">{feat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── SOCIAL PROOF SECTION ─────────────────────────────────────────────
function SocialProof() {
  const testimonials = [
    { name: 'Amara Kofi', role: 'CTO, Paystack rival', text: '"We replaced three separate auth libraries with Aurum and cut our auth-related support tickets by half within a week."', init: 'AK', bg: 'linear-gradient(135deg,#7C5CFC,#5B3EE8)' },
    { name: 'Mei Reyes', role: 'Lead Engineer, Fable', text: '"The dashboard is genuinely elegant — I\'ve actually started showing it to clients. Aurum feels like it belongs in a fintech."', init: 'MR', bg: 'linear-gradient(135deg,#A8D5BA,#5BB68A)' },
    { name: 'Tobias Lindqvist', role: 'Indie hacker', text: '"Setup took under 20 minutes. I kept expecting a catch. There wasn\'t one. The docs are actually written for humans."', init: 'TL', bg: 'linear-gradient(135deg,#F5A623,#E8812A)' },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F0EEFF] to-[#F0EEFF]/40 border-t border-b border-[rgba(124,92,252,0.14)] py-20 px-6 mb-32">
      <div className="max-w-[1080px] mx-auto">
        <div className="text-[0.78rem] font-semibold tracking-widest uppercase text-[#7C5CFC] mb-3.5">From the community</div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1B69] mb-12">Built by developers, trusted by teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white/65 border border-[rgba(124,92,252,0.14)] rounded-2xl p-7 backdrop-blur-sm">
              <div className="flex gap-0.5 text-[#F5A623] text-sm mb-3.5">★★★★★</div>
              <div className="font-serif italic text-[0.95rem] leading-relaxed text-[#2D1B69] mb-4.5 mb-4">{t.text}</div>
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full grid place-items-center text-[0.72rem] font-bold text-white" style={{ background: t.bg }}>{t.init}</div>
                <div>
                  <div className="text-[0.82rem] font-semibold text-[#2D1B69]">{t.name}</div>
                  <div className="text-[0.75rem] text-[#6B6080]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA BANNER SECTION ───────────────────────────────────────────────
function CTABanner() {
  return (
    <div className="max-w-[860px] mx-auto mb-24 px-6">
      <div className="relative bg-gradient-to-br from-[#2D1B69] to-[#4B2DA8] rounded-[24px] py-16 px-14 text-center shadow-[0_32px_80px_rgba(45,27,105,0.28)] overflow-hidden">
        {/* Abstract vector accents */}
        <div className="absolute top-[-60px] right-[-60px] w-70 h-70 w-[280px] h-[280px] rounded-full bg-radial from-[#A919FD]/25 to-transparent radial-accent-1 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(169,145,253,0.25), transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-40px] w-[260px] h-[260px] rounded-full bg-radial from-[#A8D5BA]/15 to-transparent radial-accent-2 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,213,186,0.15), transparent 70%)' }} />

        <h2 className="relative z-10 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">Start in minutes.<br />Scale without limits.</h2>
        <p className="relative z-10 text-base text-white/70 mb-9">Free up to 10,000 monthly active users. No credit card required.</p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 max-w-[420px] mx-auto">
          <input className="flex-1 px-4 py-3.25 py-3.5 rounded-v-xl rounded-lg border border-white/20 bg-white/12 text-white text-sm outline-none placeholder:text-white/45 focus:border-white/50 focus:bg-white/18" type="email" placeholder="your@email.com" />
          <button className="px-6 py-3.5 rounded-lg bg-white text-[#2D1B69] text-sm font-bold border-none cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90">Get started</button>
        </div>
      </div>
    </div>
  );
}

// ── FOOTER SECTION ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgba(124,92,252,0.14)] px-5 py-10 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Logo />
      <span className="text-[0.8rem] text-[#6B6080]">© 2026 Aurum Inc. All rights reserved.</span>
      <ul className="flex gap-6 list-none">
        {['Privacy', 'Terms', 'Status', 'GitHub'].map((link) => (
          <li key={link}>
            <Link href="#" className="text-[0.8rem] text-[#6B6080] transition-colors hover:text-[#7C5CFC]">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}