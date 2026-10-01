/** WhatsApp click-to-chat. Number must be digits only, with country code, no "+". */
const WHATSAPP_NUMBER = "254742998580";
const WHATSAPP_MESSAGE =
  "Hi FrankTech, I'd like to book a consultation.";

export const profile = {
  name: "Francis Macharia",
  brand: "FrankTech",
  role: "ICT Professional",
  tagline: "Friendly, reliable tech solutions for modern teams.",
  email: "francwanjiku2@gmail.com",
  phone: "0742998580",
  // E.164 form, used for tel: links and schema.org telephone.
  phoneE164: "+254742998580",
  phoneHref: "tel:+254742998580",
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`,
  location: "Nairobi, Kenya",
  city: "Nairobi",
  region: "Nairobi County",
  country: "KE",
  countryName: "Kenya",
  availability: "Available for new work",
  responseTime: "Replies within 24 hours",
  bio: [
    "I'm Francis Macharia — the person behind FrankTech. I've spent years troubleshooting, installing and maintaining computer systems for homes, offices and small businesses, and I still believe the best IT support should feel calm, not stressful.",
    "My approach is simple: understand the problem properly, explain it in plain language, and fix it in a way that lasts. No jargon, no guesswork, and no leaving you half-solved.",
  ],
  stats: [
    { value: 8, suffix: "+", label: "Years hands-on" },
    { value: 350, suffix: "+", label: "Devices resolved" },
    { value: 120, suffix: "+", label: "Jobs completed" },
    { value: 100, suffix: "%", label: "Client care" },
  ],
};

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const heroRotatingRoles = [
  "ICT Support & Creative Tech",
  "Networking & Infrastructure",
  "CCTV & Security Systems",
  "Hardware Repair & Upgrades",
];

export const heroBadges = [
  "Network Setup",
  "Device Care",
  "Security Systems",
  "Data Analysis",
  "Photography",
];

export const marqueeItems = [
  "Technical Support",
  "CCTV Installation",
  "Networking",
  "System Maintenance",
  "IT Consultation",
  "Data Analysis",
  "Software Upgrades",
  "Photography",
];

export const expertise = [
  { name: "Technical Support", level: 95 },
  { name: "Network Setup", level: 90 },
  { name: "System Maintenance", level: 93 },
  { name: "Security Systems", level: 88 },
  { name: "Data Analysis", level: 82 },
  { name: "Photography", level: 80 },
];

export const services = [
  {
    id: "cctv",
    icon: "cctv",
    title: "CCTV Installation",
    summary:
      "Secure monitoring systems for homes, offices and commercial spaces.",
    details:
      "Site survey, camera placement planning, clean cabling, DVR/NVR setup, remote viewing on your phone, and a handover walkthrough so you actually know how to use it.",
    points: ["4K camera options", "Mobile remote access", "Homes & commercial"],
  },
  {
    id: "repair",
    icon: "wrench",
    title: "PC Repair & Maintenance",
    summary:
      "Hardware diagnostics, upgrades, software cleanup and routine servicing.",
    details:
      "I'll find the real cause before replacing anything. Diagnostics, SSD/RAM upgrades, OS reinstalls, thermal servicing and a health report so you know exactly where your machine stands.",
    points: ["Free diagnostics", "Same-day repair", "Health report"],
  },
  {
    id: "consult",
    icon: "compass",
    title: "IT Consultation",
    summary:
      "Guidance on tools, infrastructure planning and practical technology decisions.",
    details:
      "A clear, budget-first plan for the kit you need — not the kit a vendor wants to sell you. Buying advice, infrastructure roadmaps and honest recommendations you can act on.",
    points: ["Needs assessment", "Budget planning", "No sales pitch"],
  },
  {
    id: "software",
    icon: "code",
    title: "Software Maintenance",
    summary:
      "System software setup, updates, troubleshooting and optimisation.",
    details:
      "Clean installs, licensing, updates, driver conflicts, licensing issues and performance tuning — so your machine stays fast long after I've left.",
    points: ["Clean installs", "Driver fixes", "Performance tuning"],
  },
  {
    id: "networking",
    icon: "network",
    title: "Networking",
    summary:
      "LAN/Wi-Fi setup, router configuration and stable connectivity solutions.",
    details:
      "Dead zones, weak signal, router misconfiguration and cable faults. Structured cabling, mesh or access-point layouts, and network hardening that keeps your data private.",
    points: ["Wi-Fi coverage", "Structured cabling", "Router config"],
  },
  {
    id: "data",
    icon: "chart",
    title: "Data Analysis",
    summary:
      "Turning data into useful insights through organised, clear reporting.",
    details:
      "Spreadsheet modelling, dashboards and plain-English reports. You get the finding and the recommendation — not a wall of numbers to interpret yourself.",
    points: ["Dashboards", "Clean reporting", "Plain-English insight"],
  },
  {
    id: "photo",
    icon: "camera",
    title: "Photography",
    summary:
      "Professional photography for events, branding and documentation.",
    details:
      "Product, event and project-documentation photography, colour-corrected and delivered in the sizes and formats you actually need.",
    points: ["Events", "Branding", "High-res delivery"],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Reach Out",
    description:
      "Send a short message or call. Tell me what's happening in your own words — no technical vocabulary needed.",
  },
  {
    step: "02",
    title: "Assess",
    description:
      "I diagnose remotely or on-site, confirm the root cause, and give you a clear quote before any work begins.",
  },
  {
    step: "03",
    title: "Fix",
    description:
      "The work gets done at a time that suits you, with updates along the way. Most jobs are finished same-day.",
  },
  {
    step: "04",
    title: "Handover",
    description:
      "I walk you through what changed, how to use it, and how to keep it healthy. Then I stay reachable if anything comes up.",
  },
];

export const timeline = [
  {
    period: "2021 — Present",
    title: "Independent ICT Technician",
    description:
      "Running FrankTech: on-site and remote support for households, SMEs and offices across Nairobi.",
  },
  {
    period: "2019 — 2021",
    title: "IT Support Technician",
    description:
      "Managed end-to-end IT for a busy service team — workstations, networks, user accounts and vendor liaison.",
  },
  {
    period: "2017 — 2019",
    title: "Computer Repair & Networking",
    description:
      "Hardware repair, structured cabling and network installation for retail and residential clients.",
  },
];

export const projectCategories = [
  "All",
  "Networking",
  "Security",
  "Support",
  "Development",
  "Visual",
];

export const projects = [
  {
    id: "office-network",
    title: "Office Network Overhaul",
    category: "Networking",
    description:
      "Full structured cabling and a mesh Wi-Fi redesign for a 40-seat office — dead zones eliminated across three floors.",
    tags: ["LAN", "Wi-Fi", "Cabling"],
    metric: "3 floors",
    icon: "network",
  },
  {
    id: "warehouse-cctv",
    title: "Warehouse CCTV System",
    category: "Security",
    description:
      "16-camera installation with remote mobile monitoring, covering loading bays, entry points and stock areas.",
    tags: ["CCTV", "NVR", "Remote"],
    metric: "16 cameras",
    icon: "cctv",
  },
  {
    id: "pos-repair",
    title: "POS Terminal Recovery",
    description:
      "Recovered a crashed point-of-sale terminal during a trading hour and hardened the backup routine afterwards.",
    category: "Support",
    tags: ["Repair", "POS", "Emergency"],
    metric: "2 hrs",
    icon: "wrench",
  },
  {
    id: "dashboard",
    title: "Sales Reporting Dashboard",
    description:
      "Automated dashboard that replaced a weekly manual spreadsheet report, saved roughly six hours per month.",
    category: "Development",
    tags: ["Reporting", "Automation"],
    metric: "6 hrs/mo saved",
    icon: "chart",
  },
  {
    id: "home-security",
    title: "Smart Home Security",
    description:
      "Camera and motion-sensor package for a family home, with mobile alerts and a simple handover session.",
    tags: ["Smart home", "Alerts"],
    metric: "24/7 cover",
    icon: "cctv",
  },
  {
    id: "brand-shoot",
    title: "Brand Product Shoot",
    description:
      "Product photography for a small retail brand — 40 edited images delivered across web and social formats.",
    category: "Visual",
    tags: ["Product", "Editing"],
    metric: "40 images",
    icon: "camera",
  },
];

export const testimonials = [
  {
    quote:
      "Our Wi-Fi used to drop every afternoon and nobody could tell me why. Frank had it diagnosed, mapped and stable within two days — and explained it in a way I could actually repeat to my team.",
    name: "Achieng O.",
    role: "Operations Manager",
    company: "Retail & distribution",
  },
  {
    quote:
      "He rebuilt our CCTV system from scratch. The install is tidy, the mobile view works perfectly, and the handover session meant we're not calling anyone when something looks odd.",
    name: "Brian K.",
    role: "Founder",
    company: "Logistics firm",
  },
  {
    quote:
      "What stood out was the honesty. He told me the upgrade I wanted wasn't worth the money yet, and suggested what would actually help. That's rare.",
    name: "Mercy W.",
    role: "Office Administrator",
    company: "Professional services",
  },
  {
    quote:
      "Called at 9am, laptop dead by 10:30, and it had more memory and a clean install than when it was new. Communication throughout was excellent.",
    name: "Samuel N.",
    role: "Accountant",
    company: "Independent",
  },
];

export const pricing = [
  {
    id: "essentials",
    name: "Essentials",
    blurb: "For individuals and single devices that just need to work reliably.",
    price: 2500,
    features: [
      "Remote troubleshooting",
      "Virus & malware removal",
      "Software installation & updates",
      "Up to 1 device",
      "Business-hours support",
    ],
    cta: "Book Essentials",
    featured: false,
  },
  {
    id: "professional",
    name: "Professional",
    blurb: "For small businesses that need a thorough on-site visit.",
    price: 8500,
    features: [
      "Everything in Essentials",
      "On-site visit at your premises",
      "Network & Wi-Fi configuration",
      "Up to 10 devices",
      "Priority scheduling",
      "Written report of what was done",
    ],
    cta: "Book Professional",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For offices needing security installs and infrastructure projects.",
    price: null,
    features: [
      "Everything in Professional",
      "Unlimited devices",
      "CCTV & security installation",
      "Structured cabling & infrastructure",
      "24/7 emergency callout",
      "Documentation & handover notes",
    ],
    cta: "Request a quote",
    featured: false,
  },
];

export const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "I'm based in Nairobi and cover on-site work across the city and surrounding areas. Remote support is available nationwide, and I'm happy to travel further for larger projects — just ask.",
  },
  {
    question: "How quickly can you respond?",
    answer:
      "Messages are usually answered within 24 hours, and same-day slots are often available. Enterprise clients get a 24/7 emergency line for genuine outages.",
  },
  {
    question: "Do you charge for diagnostics?",
    answer:
      "Diagnosis is free and included in the quote I give you before any work starts. If you decide not to proceed, there's nothing to pay — apart from clearly flagged hardware replacement parts.",
  },
  {
    question: "Can you work with hardware I already own?",
    answer:
      "Absolutely. I'll happily support, repair or upgrade whatever equipment you have. I'll only recommend buying new if it genuinely isn't worth repairing.",
  },
  {
    question: "How does charging work?",
    answer:
      "Every job is charged per visit — there's no retainer or subscription. You book when you need help, I confirm the price in writing beforehand, and you're invoiced for that visit only. Repeat visits are simply booked the same way.",
  },
  {
    question: "Will you sign an NDA or work confidentially?",
    answer:
      "Of course. Confidentiality comes standard, and I'm happy to sign an NDA before starting any commercial or sensitive engagement.",
  },
];

export const footerLinks = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const socials = [
  { id: "email", label: "Email", href: `mailto:${profile.email}` },
  { id: "phone", label: "Phone", href: profile.phoneHref },
];