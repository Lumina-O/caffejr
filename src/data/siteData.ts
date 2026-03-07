// src/data/siteData.ts
export const siteData = {
  brand: "Caffe Jr.",
  nav: [
    { label: "SPECIAL OFFERS", href: "#hero" },
    { label: "OUR STORY", href: "#help" },
    { label: "CONSULTATION", href: "#process" },
    { label: "CONTACT", href: "#contact" },
  ],
  hero: {
    title: "CAFFE JUNIOR",
    leftTitle: "EKSPERTER I REPARATION & SERVICE AF KAFFEMASKINER",
    leftText:
      "Vi reparerer, servicerer og fejlfinder kaffemaskiner med fokus på kvalitet og holdbare løsninger. Du får en klar vurdering, før vi går i gang.",
    cta: "Book service på stedet eller værksted",
    rightTitle: "PROFESSIONEL KAFFEMASKINESERVICE",
    serviceBullets: ["Vær hurtig", "Fejlfinding", "Lokalt"],
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
    title: "SÅDAN FOREGÅR DET",
    subtitle:
      "Simpelt, hurtigt og gennemsigtigt. Du ved hvad der sker, hele vejen.",
    steps: [
      {
        number: "1",
        title: "Book service",
        text: "Udfyld kontakt. Vi ringer under 1 min.",
      },
      {
        number: "2",
        title: "Diagnose",
        text: "Vi tester og finder fejlen, før vi udfører noget.",
      },
      {
        number: "3",
        title: "Reparation",
        text: "Vi fikser problemet med kvalitetsdele og håndkraft.",
      },
      {
        number: "4",
        title: "Test og afhent",
        text: "Vi tester maskinen grundigt. Du er klar igen.",
      },
    ],
    buttons: ["Book Reparation", "Er service muligt"],
  },
  testimonials: {
    title: "DET SIGER KUNDERNE",
    subtitle:
      "Simpelt, hurtigt og gennemsigtigt. Du ved hvad der sker, hele vejen.",
    cards: [
      {
        rating: "★★★★★",
        text: "Rigtig hurtigt og god kommunikation. Maskinen kører som ny nu.",
        name: "Kunde, København",
      },
      {
        rating: "★★★★★",
        text: "Rigtig service og god kommunikation. Maskinen kører som ny nu.",
        name: "Kunde, København",
      },
      {
        rating: "★★★★★",
        text: "Rigtig service og god kommunikation. Maskinen kører som ny nu.",
        name: "Kunde, København",
      },
      {
        rating: "★★★★★",
        text: "Rigtig service og god kommunikation. Maskinen kører som ny nu.",
        name: "Kunde, København",
      },
    ],
    button: "Book Nu",
  },
  contact: {
    title: "KONTAKT",
    subtitle:
      "Ring eller book online. Jo mere info du giver, jo hurtigere kan vi hjælpe.",
    phone: "+45 53 51 24 03",
    email: "caffejrinfo@gmail.com",
    address: "Vigerslevvej 50A, 2500 Valby",
    hours: "Mandag til fredag kl. 9:00 - 17:00",
  },
};

// TODO: Replace placeholder testimonials and phone/email if customer sends updated info.