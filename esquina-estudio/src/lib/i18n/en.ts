import type { Dictionary } from "@/lib/i18n/types";

/**
 * Variante inglesa: **la que sirve el servidor**, siempre. Es también la base de
 * comparación de la no-regresión: si un texto de acá cambia, cambia el sitio en
 * inglés. Los textos son verbatim de lo que ya estaba en los componentes; este
 * archivo los centraliza, no los reescribe.
 */
export const EN: Dictionary = {
  common: {
    language: "Language",
    languageNames: { en: "English", es: "Spanish" },
  },

  nav: {
    work: "WORK",
    services: "SERVICES",
    team: "TEAM",
    gallery: "FUN GALLERY",
    contact: "CONTACT US",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    logoHome: "ESQUINA ESTUDIO home",
    currentPage: "current page",
  },

  footer: {
    places: [
      ["BORN IN", "ARGENTINA"],
      ["WORKING", "WORLDWIDE"],
    ],
    poweredBy: "POWERED BY",
    contactCta: "CONTACT US",
    contactLines: ["LET'S BRING", "YOUR IDEAS TO LIFE"],
    clubCta: "JOIN OUR CLUB",
    clubLines: ["BECOME PART OF A", "CREATIVE COMMUNITY"],
  },

  team: {
    intro: [
      "<b>ESQUINA ESTUDIO</b>™ is a design studio focused on building brands",
      "and shaping ideas with clarity, intention, and strong visual identity.",
      "We help startups turn their vision into professional, visually",
      "compelling businesses, while also working with established",
      "brands to rethink and elevate their identity.",
    ],
    foundedBy: [
      "Founded by ",
      "Virginia and Victoria",
      " — also known as Vireli and Toli — the studio is built on a lifelong creative partnership. We've been friends since we were four years old, and later studied Multimedia Design together in Tucumán, Argentina.",
    ],
    bio: "Over the years, we've developed a shared eye and a deep understanding of visual identity — and the real value it holds today for brands of all sizes. We're inspired by fashion, food, and design in all its forms, constantly observing and translating what we see into thoughtful, intentional brand experiences.",
    approach: `Our vision blends aesthetics, concept, and timeless foundations. We are highly
detail-oriented and believe that strong design lives in both the big picture and the smallest decisions.

We work closely with our clients through direct communication, making collaboration an essential part of the process. Our priority is to bring each vision to life through our creative perspective — staying open, thoughtful, and focused on finding the most fitting solution for every project.`,
    headed: `Looking ahead, we aim to grow beyond borders. As we prepare to move to Australia, our goal is
to expand our reach and work with clients worldwide — collaborating with people from different places, cultures, and industries.


We're driven by the idea of helping others build something of their own — turning ideas into real, tangible brands with intention, character, and identity.`,
    sections: ["THE TEAM", "OUR APPROACH", "WHERE WE ARE HEADED"],
    photoAlt: "ESQUINA ESTUDIO team",
  },

  services: {
    introLabel: "Intro",
    sidebarLabel: "Services sections",
  },

  gallery: {
    title: ["HAVE FUN EXPLORING", "OUR PROJECTS!"],
    hint: "(click to view)",
    sectionLabel: "Fun Gallery",
    viewItem: "View",
    errorTitle: "THE GALLERY IS NOT AVAILABLE RIGHT NOW",
    errorDetail:
      "WE COULD NOT LOAD THE IMAGES. PLEASE TRY AGAIN IN A FEW MINUTES.",
    emptyTitle: "THE GALLERY IS EMPTY FOR NOW",
    emptyDetail: "NEW IMAGES ARE ON THEIR WAY.",
  },

  form: {
    title: ["LET'S BRING", "YOUR IDEAS", "TO LIFE"],
    subtitle: ["SHARE YOUR PROJECT DETAILS", "TO RECEIVE A CUSTOM PROPOSAL"],
    formLabel: "Project questionnaire",
    labels: {
      fullName: ["STATE YOUR", "FULL NAME *"],
      email: ["EMAIL", "ADDRESS *"],
      workType: ["WHAT ARE YOU", "LOOKING TO WORK ON?"],
      businessType: ["WHAT BEST DESCRIBES", "YOUR BUSINESS?"],
      industry: ["WHAT IS YOUR", "INDUSTRY/FIELD"],
      country: ["WHERE ARE", "YOU BASED?"],
      timeline: ["DO YOU HAVE A", "TIMELINE IN MIND?"],
      budget: ["WHAT IS YOUR", "BUDGET RANGE?"],
      hearAbout: ["HOW DID YOU", "HEAR ABOUT US?"],
    },
    placeholders: {
      name: "NAME",
      email: "EMAIL",
      select: "SELECT OPTION",
      shortAnswer: "SHORT ANSWER",
      search: "SEARCH",
    },
    noResults: "No results",
    submit: "SEND QUESTIONNAIRE",
    submitting: "SENDING...",
    submitError: "We could not send your questionnaire. Please try again.",
    validation: {
      fullName: "Please enter your full name",
      email: "Please enter a valid email",
    },
  },

  success: {
    title: ["YOUR INQUIRY WAS SENT", "SUCCESSFULLY!"],
    body: "WE APPRECIATE YOU TAKING THE TIME TO SHARE YOUR VISION WITH US. OUR TEAM WILL REVIEW YOUR SUBMISSION AND GET BACK TO YOU AS SOON AS POSSIBLE.",
    sectionLabel: "Inquiry sent confirmation",
    backHome: "BACK TO HOME",
  },

  work: {
    backToGallery: "Back to Fun Gallery",
    allProjects: "All Projects",
    next: "Next",
    contentSoon: "Project content coming soon.",
    mediaAlt: "Project media",
    videoTitle: "Project video",
  },
};
