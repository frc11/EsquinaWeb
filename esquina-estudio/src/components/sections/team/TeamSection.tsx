"use client";

import Image from "next/image";
import ImageLoadIndicator, {
  useImageLoad,
} from "@/components/ui/ImageLoadIndicator";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useLocale } from "@/lib/i18n";

const TEAM_REVEAL_DELAY = 0.3;
const TEAM_REVEAL_DURATION = 0.8;
const TEAM_ASIDE_INITIAL_Y = 20;
const TEAM_TEXT_INITIAL_X = 40;
const TEAM_IMAGE_INITIAL_X = 40;
const TEAM_ASIDE_DELAY = TEAM_REVEAL_DELAY - 0.2;
const TEAM_TEXT_DELAY = TEAM_ASIDE_DELAY + TEAM_REVEAL_DURATION - 0.4;
const TEAM_IMAGE_DELAY = TEAM_TEXT_DELAY;

function StudioIntro() {
  const { t } = useLocale();

  return (
    <RevealOnScroll delay={0.5}>
      <section className="mx-auto w-full text-center font-body text-[22px] leading-[1.2] text-off-black md:text-[32px] lg:text-[40px]">
        {t.team.intro.map((line, index) => (
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
      <div className="mx-auto flex h-[clamp(260px,42svh,520px)] w-full max-w-[1500px] items-center justify-center border border-off-black/10 bg-gray-brand/20">
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
  const { t } = useLocale();
  const teamPhoto = useImageLoad();
  const bodySpacingClass = id === "03" ? "space-y-0" : "space-y-8";

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-[235px_minmax(0,1fr)] md:gap-[60px]">
      <RevealOnScroll
        delay={TEAM_ASIDE_DELAY}
        duration={TEAM_REVEAL_DURATION}
        initialY={TEAM_ASIDE_INITIAL_Y}
        className="md:sticky md:top-24 md:self-start"
      >
        <aside className="grid w-full grid-cols-[28px_1fr] gap-5 pt-[6px] font-body text-[17px] uppercase leading-none tracking-wide text-off-black md:w-[246px]">
          <span>{id}</span>
          <span>{label}</span>
        </aside>
      </RevealOnScroll>

      {/*
        `pl-10` es una sangría de escritorio: a 320 se comía 40 de los 272 px
        útiles. Y `max-md:overflow-x-clip` es lo que le da lugar al gesto de
        entrada: `RevealOnScroll` arranca los bloques en `translateX(40px)` y
        eso, medido en F0, era el ÚNICO desborde de página del sitio —16 px en
        las cinco anchuras—. El recorte es local a esta columna y solo debajo
        de `md`, así que no toca el `sticky` del aside (CLAUDE.md §7 prohíbe
        `overflow` recortante en los ancestros de un `sticky`, y de `md` para
        arriba no hay ninguno).
      */}
      <div className="min-w-0 flex-1 max-md:overflow-x-clip md:pl-10">
        <RevealOnScroll
          delay={TEAM_TEXT_DELAY}
          duration={TEAM_REVEAL_DURATION}
          initialX={TEAM_TEXT_INITIAL_X}
          initialY={0}
        >
          {id === "01" ? (
            <div className="max-w-[1280px] space-y-8 font-body text-[20px] leading-[1.25] text-off-black md:text-[30px]">
              <p>
                {t.team.foundedBy[0]}
                <strong className="font-medium">{t.team.foundedBy[1]}</strong>
                {t.team.foundedBy[2]}
              </p>
              <p>{t.team.bio}</p>
            </div>
          ) : (
            <div className={`max-w-[1285px] ${bodySpacingClass} whitespace-pre-line font-body text-[20px] leading-[1.25] text-off-black md:text-[30px]`}>
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
            {/*
              `relative` para que el indicador tenga contra qué posicionarse.
              La caja ya reservaba su lugar con el `bg-gray-brand/20` y el
              alto que le da el `width`/`height` de la imagen, así que el
              anillo cae centrado sobre ese hueco y no mueve nada.
            */}
            <div className="relative mt-12 w-full overflow-hidden bg-gray-brand/20 text-off-black md:mt-24">
              <Image
                src="/projects/team.jpg"
                alt={t.team.photoAlt}
                width={1600}
                height={900}
                // El `calc()` del término de escritorio es a propósito: ver la
                // nota sobre `sizes` en `src/lib/mobile-layout.ts`.
                sizes="(max-width: 767.98px) calc(100vw - 48px), calc(80vw)"
                className="h-auto w-full"
                onLoad={teamPhoto.onLoad}
                onError={teamPhoto.onError}
              />
              <ImageLoadIndicator show={teamPhoto.showIndicator} />
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}

export default function TeamSection() {
  const { t } = useLocale();

  return (
    <main className="mb-16 px-6 pb-16 md:mb-32 md:px-12">
      <section className="flex min-h-[calc(100svh-var(--header-height,96px))] flex-col items-center justify-start gap-[clamp(20px,3svh,34px)] pb-[clamp(24px,4svh,48px)] pt-[clamp(40px,7svh,78px)]">
        <StudioIntro />
        <TeamVideo />
      </section>
      <div className="space-y-20 md:space-y-32">
        <TeamSubsection id="01" label={t.team.sections[0]} showSlide />
        <TeamSubsection
          id="02"
          label={t.team.sections[1]}
          content={t.team.approach}
        />
        <TeamSubsection
          id="03"
          label={t.team.sections[2]}
          content={t.team.headed}
        />
      </div>
    </main>
  );
}
