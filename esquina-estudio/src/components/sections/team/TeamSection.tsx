"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const studioIntroLines = [
  "<b>ESQUINA ESTUDIO</b>™ is a design studio focused on building brands",
  "and shaping ideas with clarity, intention, and strong visual identity.",
  "We help startups turn their vision into professional, visually",
  "compelling businesses, while also working with established",
  "brands to rethink and elevate their identity.",
];

const teamParagraphs = [
  "Founded by ",
  "Virginia and Victoria",
  " — also known as Vireli and Toli — the studio is built on a lifelong creative partnership. We've been friends since we were four years old, and later studied Multimedia Design together in Tucumán, Argentina.",
  "Over the years, we've developed a shared eye and a deep understanding of visual identity — and the real value it holds today for brands of all sizes. We're inspired by fashion, food, and design in all its forms, constantly observing and translating what we see into thoughtful, intentional brand experiences.",
] as const;

const approachContent = `Our vision blends aesthetics, concept, and timeless foundations. We are highly
detail-oriented and believe that strong design lives in both the big picture and the smallest decisions.

We work closely with our clients through direct communication, making collaboration an essential part of the process. Our priority is to bring each vision to life through our creative perspective — staying open, thoughtful, and focused on finding the most fitting solution for every project.`;

const headedContent = `Looking ahead, we aim to grow beyond borders. As we prepare to move to Australia, our goal is
to expand our reach and work with clients worldwide — collaborating with people from different places, cultures, and industries.

We're driven by the idea of helping others build something of their own — turning ideas into real, tangible brands with intention, character, and identity.`;

const TEAM_REVEAL_DELAY = 0.3;
const TEAM_REVEAL_DURATION = 0.8;
const TEAM_ASIDE_INITIAL_Y = 20;
const TEAM_TEXT_INITIAL_X = 40;
const TEAM_IMAGE_INITIAL_X = 40;
const TEAM_ASIDE_DELAY = TEAM_REVEAL_DELAY - 0.2;
const TEAM_TEXT_DELAY = TEAM_ASIDE_DELAY + TEAM_REVEAL_DURATION - 0.4;
const TEAM_IMAGE_DELAY = TEAM_TEXT_DELAY;

function StudioIntro() {
  return (
    <RevealOnScroll delay={0.5}>
      <section className="mx-auto w-full text-center font-body text-[32px] leading-[1.2] text-off-black md:text-[40px]">
        {studioIntroLines.map((line, index) => (
          <p
            key={index}
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
      </section>
    </RevealOnScroll>
  );
}

function TeamVideo() {
  return (
      <div className="mx-auto flex h-[clamp(260px,42vh,520px)] w-full max-w-[1500px] items-center justify-center border border-off-black/10 bg-gray-brand/20">
        <span className="font-body text-sm uppercase tracking-wider text-gray-brand">
          VIDEO O GIF
        </span>
      </div>
  );
}

function TeamSubsection({
  id,
  label,
  content,
  showSlide = false,
}: {
  id: string;
  label: string;
  content?: string;
  showSlide?: boolean;
}) {
  const bodySpacingClass = id === "03" ? "space-y-0" : "space-y-8";

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-[235px_minmax(0,1fr)] md:gap-[60px]">
      <RevealOnScroll
        delay={TEAM_ASIDE_DELAY}
        duration={TEAM_REVEAL_DURATION}
        initialY={TEAM_ASIDE_INITIAL_Y}
        className="md:sticky md:top-24 md:self-start"
      >
        <aside className="grid w-[246px] grid-cols-[28px_1fr] gap-5 pt-[6px] font-body text-[17px] uppercase leading-none tracking-wide text-off-black">
          <span>{id}</span>
          <span>{label}</span>
        </aside>
      </RevealOnScroll>

      <div className="min-w-0 flex-1 pl-10">
        <RevealOnScroll
          delay={TEAM_TEXT_DELAY}
          duration={TEAM_REVEAL_DURATION}
          initialX={TEAM_TEXT_INITIAL_X}
          initialY={0}
        >
          {id === "01" ? (
            <div className="max-w-[1280px] space-y-8 font-body text-[24px] leading-[1.25] text-off-black md:text-[30px]">
              <p>
                {teamParagraphs[0]}
                <strong className="font-medium">{teamParagraphs[1]}</strong>
                {teamParagraphs[2]}
              </p>
              <p>{teamParagraphs[3]}</p>
            </div>
          ) : (
            <div className={`max-w-[1285px] ${bodySpacingClass} whitespace-pre-line font-body text-[24px] leading-[1.25] text-off-black md:text-[30px]`}>
              {content?.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </RevealOnScroll>

        {showSlide && (
          <RevealOnScroll
            delay={TEAM_IMAGE_DELAY}
            duration={TEAM_REVEAL_DURATION}
            initialX={TEAM_IMAGE_INITIAL_X}
            initialY={0}
          >
            <div className="mt-24 w-full overflow-hidden bg-gray-brand/20">
              <Image
                src="/projects/team.jpg"
                alt="ESQUINA ESTUDIO team"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="h-auto w-full"
              />
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}

export default function TeamSection() {
  return (
    <main className="px-6 pb-16 md:px-12 mb-32">
      <section className="flex min-h-[calc(100vh-var(--header-height,96px))] flex-col items-center justify-start gap-[clamp(20px,3vh,34px)] pb-[clamp(24px,4vh,48px)] pt-[clamp(40px,7vh,78px)]">
        <StudioIntro />
        <TeamVideo />
      </section>
      <div className="space-y-32">
        <TeamSubsection id="01" label="THE TEAM" showSlide />
        <TeamSubsection
          id="02"
          label="OUR APPROACH"
          content={approachContent}
        />
        <TeamSubsection
          id="03"
          label="WHERE WE ARE HEADED"
          content={headedContent}
        />
      </div>
    </main>
  );
}
