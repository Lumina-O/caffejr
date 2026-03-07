export type Language = "da" | "en";

type NavItem = {
  label: string;
  href: string;
};

type HelpCard = {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
};

type ProcessStep = {
  number: string;
  title: string;
  text: string;
};

type TestimonialCard = {
  rating: string;
  text: string;
  name: string;
};

type SiteContent = {
  brand: string;
  nav: NavItem[];
  hero: {
    title: string;
    leftTitle: string;
    leftText: string;
    cta: string;
    rightTitle: string;
    serviceBullets: string[];
    serviceTexts: string[];
  };
  help: {
    title: string;
    subtitle: string;
    cards: HelpCard[];
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    promise: {
      title: string;
      text: string;
    };
    steps: ProcessStep[];
    buttons: string[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    cards: TestimonialCard[];
    button: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
};

export const siteData: Record<Language, SiteContent> = {
  da: {
    brand: "Caffe Jr.",
    nav: [
      { label: "TILBUD", href: "#help" },
      { label: "KONSULTATION", href: "#process" },
      { label: "REVIEW", href: "#testimonials" },
      { label: "KONTAKT", href: "#contact" },
    ],
    hero: {
      title: "CAFFE JUNIOR",
      leftTitle: "EKSPERTER I REPARATION & SERVICE AF KAFFEMASKINER",
      leftText:
        "Vi reparerer, servicerer og fejlfinder kaffemaskiner med fokus på kvalitet og holdbare løsninger. Du får en klar vurdering, før vi går i gang.",
      cta: "Book service på stedet eller værksted",
      rightTitle: "PROFESSIONEL KAFFEMASKINESERVICE",
      serviceBullets: ["Hurtig hjælp", "Fejlfinding", "Lokalt"],
      serviceTexts: [
        "Vi vender typisk tilbage samme dag",
        "Præcis diagnose før reparation",
        "Service tæt på dig",
      ],
    },
    help: {
      title: "HVAD KAN VI HJÆLPE MED?",
      subtitle:
        "Vælg det, der passer dig. Hvis du er i tvivl, så book fejlfinding og få en klar vurdering.",
      cards: [
        {
          eyebrow: "Reparation",
          title: "Få maskinen tilbage i topform",
          text: "Vi skifter sliddele, løser lækager, temperaturproblemer og elektriske fejl.",
          points: [
            "Akut hjælp muligt",
            "Reservedele i kvalitet",
            "Professionel efter reparation",
          ],
        },
        {
          eyebrow: "Service",
          title: "Rens, afkalkning og kalibrering",
          text: "Bevar smag, forlæng levetid og undgå nedbrud med regelmæssig service.",
          points: [
            "Dybdegående gennemgang",
            "Justering af bryg og tryk",
            "Input til daglig vedligehold",
          ],
        },
        {
          eyebrow: "Fejlfinding",
          title: "Find årsagen, før vi fikser",
          text: "Har maskinen opført sig mærkeligt, stoppet med at varme, dryppet eller støjet?",
          points: [
            "Hurtig vurdering",
            "Gennemgang af symptomer",
            "Konkret løsning",
          ],
        },
      ],
    },
    process: {
      eyebrow: "Sådan foregår det",
      title: "SÅDAN FOREGÅR DET",
      subtitle:
        "Simpelt, hurtigt og gennemsigtigt. Du ved, hvad der sker hele vejen.",
      promise: {
        title: "Vores service",
        text: "Et simpelt og pålideligt forløb bygget på hurtig kommunikation, klar planlægning og professionel håndtering af din kaffemaskine.",
      },
      steps: [
        {
          number: "1",
          title: "Book service",
          text: "Udfyld kontaktformularen. Vi ringer hurtigt tilbage.",
        },
        {
          number: "2",
          title: "Diagnose",
          text: "Vi tester og finder fejlen, før vi udfører noget.",
        },
        {
          number: "3",
          title: "Reparation",
          text: "Vi løser problemet med kvalitetsdele og professionelt arbejde.",
        },
        {
          number: "4",
          title: "Test og afhent",
          text: "Vi tester maskinen grundigt. Så er du klar igen.",
        },
      ],
      buttons: ["Book reparation", "Er service muligt?"],
    },
    testimonials: {
      title: "DET SIGER KUNDERNE",
      subtitle:
        "Simpelt, hurtigt og gennemsigtigt. Du ved, hvad der sker hele vejen.",
      cards: [
        {
          rating: "★★★★★",
          text: "Rigtig hurtigt og god kommunikation. Maskinen kører som ny nu.",
          name: "Kunde, København",
        },
        {
          rating: "★★★★★",
          text: "Virkelig god service og god kommunikation. Maskinen kører som ny nu.",
          name: "Kunde, København",
        },
        {
          rating: "★★★★★",
          text: "Super oplevelse fra start til slut. Klar anbefaling herfra.",
          name: "Kunde, København",
        },
        {
          rating: "★★★★★",
          text: "Hurtig fejlfinding og professionel reparation.",
          name: "Kunde, Valby",
        },
      ],
      button: "Book nu",
    },
    contact: {
      title: "KONTAKT",
      subtitle:
        "Ring eller book online. Jo mere info du giver, jo hurtigere kan vi hjælpe.",
      phone: "+45 53 51 24 03",
      email: "caffejrinfo@gmail.com",
      address: "Vigerslevvej 50A, 2500 Valby",
      hours: "Mandag til fredag kl. 16:30 - 18:30",
    },
  },

  en: {
    brand: "Caffe Jr.",
    nav: [
      { label: "OFFERS", href: "#help" },
      { label: "CONSULTATION", href: "#process" },
      { label: "REVIEW", href: "#testimonials" },
      { label: "CONTACT", href: "#contact" },
    ],
    hero: {
      title: "CAFFE JUNIOR",
      leftTitle: "EXPERTS IN COFFEE MACHINE REPAIR & SERVICE",
      leftText:
        "We repair, service, and troubleshoot coffee machines with a focus on quality and long-lasting solutions. You get a clear assessment before we begin.",
      cta: "Book on-site service or workshop repair",
      rightTitle: "PROFESSIONAL COFFEE MACHINE SERVICE",
      serviceBullets: ["Fast help", "Diagnostics", "Local"],
      serviceTexts: [
        "We usually reply the same day",
        "Accurate diagnosis before repair",
        "Service close to you",
      ],
    },
    help: {
      title: "HOW CAN WE HELP?",
      subtitle:
        "Choose what fits your needs. If you are unsure, book diagnostics and get a clear assessment.",
      cards: [
        {
          eyebrow: "Repair",
          title: "Get your machine back in top shape",
          text: "We replace worn parts and fix leaks, temperature issues, and electrical faults.",
          points: [
            "Emergency help available",
            "Quality spare parts",
            "Professional finish after repair",
          ],
        },
        {
          eyebrow: "Service",
          title: "Cleaning, descaling, and calibration",
          text: "Maintain taste, extend lifespan, and avoid breakdowns with regular service.",
          points: [
            "Thorough inspection",
            "Brew and pressure adjustment",
            "Advice for daily maintenance",
          ],
        },
        {
          eyebrow: "Diagnostics",
          title: "Find the cause before we fix it",
          text: "Is your machine acting strange, not heating, dripping, or making noise?",
          points: ["Fast assessment", "Symptom review", "Concrete solution"],
        },
      ],
    },
    process: {
      eyebrow: "How it works",
      title: "HOW IT WORKS",
      subtitle:
        "Simple, fast, and transparent. You know what is happening every step of the way.",
      promise: {
        title: "Service promise",
        text: "A simple and reliable process built around fast communication, clear planning, and expert handling of your coffee equipment.",
      },
      steps: [
        {
          number: "1",
          title: "Book service",
          text: "Fill in the contact form. We will call you back quickly.",
        },
        {
          number: "2",
          title: "Diagnosis",
          text: "We test and find the issue before carrying out any work.",
        },
        {
          number: "3",
          title: "Repair",
          text: "We fix the problem using quality parts and skilled workmanship.",
        },
        {
          number: "4",
          title: "Test and pickup",
          text: "We test the machine thoroughly. Then you are ready again.",
        },
      ],
      buttons: ["Book repair", "Is service possible?"],
    },
    testimonials: {
      title: "WHAT CUSTOMERS SAY",
      subtitle:
        "Simple, fast, and transparent. You know what is happening every step of the way.",
      cards: [
        {
          rating: "★★★★★",
          text: "Very fast and great communication. The machine runs like new now.",
          name: "Customer, Copenhagen",
        },
        {
          rating: "★★★★★",
          text: "Excellent service and clear communication throughout the process.",
          name: "Customer, Copenhagen",
        },
        {
          rating: "★★★★★",
          text: "Great experience from start to finish. Highly recommended.",
          name: "Customer, Copenhagen",
        },
        {
          rating: "★★★★★",
          text: "Fast diagnostics and professional repair.",
          name: "Customer, Valby",
        },
      ],
      button: "Book now",
    },
    contact: {
      title: "CONTACT",
      subtitle:
        "Call or book online. The more information you provide, the faster we can help.",
      phone: "+45 53 51 24 03",
      email: "caffejrinfo@gmail.com",
      address: "Vigerslevvej 50A, 2500 Valby",
      hours: "Monday to Friday 16:30 - 18:30",
    },
  },
};

export function getSiteData(language: Language = "da") {
  return siteData[language];
}
