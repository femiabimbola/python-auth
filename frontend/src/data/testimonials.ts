export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We replaced three separate auth libraries with Aurum and cut our auth-related support tickets by half within a week.',
    name: 'Amara Kofi',
    role: 'CTO, Paystack rival',
    initials: 'AK',
    gradient: 'linear-gradient(135deg,#7C5CFC,#5B3EE8)',
  },
  {
    quote:
      'The dashboard is genuinely elegant — I\'ve actually started showing it to clients. Aurum feels like it belongs in a fintech.',
    name: 'Mei Reyes',
    role: 'Lead Engineer, Fable',
    initials: 'MR',
    gradient: 'linear-gradient(135deg,#A8D5BA,#5BB68A)',
  },
  {
    quote:
      'Setup took under 20 minutes. I kept expecting a catch. There wasn\'t one. The docs are actually written for humans.',
    name: 'Tobias Lindqvist',
    role: 'Indie hacker',
    initials: 'TL',
    gradient: 'linear-gradient(135deg,#F5A623,#E8812A)',
  },
];