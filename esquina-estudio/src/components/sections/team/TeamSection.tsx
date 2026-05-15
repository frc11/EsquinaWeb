"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const studioIntro = `ESQUINA ESTUDIO™ is a design studio focused on building brands and shaping ideas with clarity, intention, and strong visual identity.
We help startups turn their vision into professional, visually compelling businesses, while also working with established brands to rethink and elevate their identity.`;

const teamParagraphs = [
  "Founded by ",
  "Virginia and Victoria",
  " — also known as Vireli and Toli — the studio is built on a lifelong creative partnership. We've been friends since we were four years old, and later studied Multimedia Design together in Tucumán, Argentina.",
  "Over the years, we've developed a shared eye and a deep understanding of visual identity — and the real value it holds today for brands of all sizes. We're inspired by fashion, food, and design in all its forms, constantly observing and translating what we see into thoughtful, intentional brand experiences.",
] as const;

const approachContent = `Our vision blends aesthetics, concept, and timeless foundations. We are highly detail-oriented and believe that strong design lives in both the big picture and the smallest decisions.

We work closely with our clients through direct communication, making collaboration an essential part of the process. Our priority is to bring each vision to life through our creative perspective — staying open, thoughtful, and focused on finding the most fitting solution for every project.`;

const headedContent = `Looking ahead, we aim to grow beyond borders. As we prepare to move to Australia, our goal is to expand our reach and work with clients worldwide — collaborating with people from different places, cultures, and industries.

We're driven by the idea of helping others build something of their own — turning ideas into real, tangible brands with intention, character, and identity.`;

function StudioIntro() {
  return (
    <RevealOnScroll>
      <section className="mx-auto w-full max-w-2xl border border-off-black p-6 text-center font-body text-[24px] leading-[1.25] text-off-black md:p-8 md:text-[30px]">
        {studioIntro.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
    </RevealOnScroll>
  );
}

function TeamVideo() {
  return (
    <RevealOnScroll>
      <div className="mx-auto my-12 flex aspect-video max-w-[700px] items-center justify-center border border-off-black/10 bg-gray-brand/20">
        <span className="font-body text-sm uppercase tracking-wider text-gray-brand">
          VIDEO O GIF
        </span>
      </div>
    </RevealOnScroll>
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
  return (
    <RevealOnScroll>
      <section className="flex flex-col gap-8 md:flex-row">
        <aside className="w-48 flex-shrink-0 font-body text-[13px] uppercase tracking-wider text-gray-brand md:sticky md:top-24 md:self-start">
          {id} {label}
        </aside>

        <div className="min-w-0 flex-1 space-y-10">
          {id === "01" ? (
            <div className="space-y-8 font-body text-[24px] leading-[1.25] text-off-black md:text-[30px]">
              <p>
                {teamParagraphs[0]}
                <strong className="font-medium">{teamParagraphs[1]}</strong>
                {teamParagraphs[2]}
              </p>
              <p>{teamParagraphs[3]}</p>
            </div>
          ) : (
            <div className="space-y-8 font-body text-[24px] leading-[1.25] text-off-black md:text-[30px]">
              {content?.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}

          {showSlide && (
            <div className="flex h-[500px] w-full items-center justify-center bg-gray-brand/20">
              <span className="font-body text-sm uppercase tracking-wider text-gray-brand">
                Slide de fotos
              </span>
            </div>
          )}
        </div>
      </section>
    </RevealOnScroll>
  );
}

export default function TeamSection() {
  return (
    <main className="space-y-24 px-6 py-16 md:px-12">
      <StudioIntro />
      <TeamVideo />
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
