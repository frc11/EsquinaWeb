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

/**
 * Una sección de Team. **Un solo camino de render para las tres** (R2/F6).
 *
 * Hasta R2 había dos: la `01` estaba escrita a mano dentro de un `id === "01"`
 * —un párrafo con énfasis más la `bio` en un `<p>` suelto— y las otras dos
 * partían un `string` por `\n\n` con `whitespace-pre-line`. De ahí salían los
 * dos defectos que reportó el PDF de mobile y que documenta `i18n/types.ts`: los
 * cortes de escritorio codificados en el copy y el renglón fantasma del `\n\n\n`
 * de `headed`, compensado con un `space-y-0` que solo se aplicaba a la `03`.
 *
 * Ahora el copy llega **ya partido en párrafos** y este componente los renderiza
 * igual en las tres, con el mismo `space-y-8`. Lo único que distingue a la `01`
 * es que su primer párrafo lleva énfasis intra-línea, y para eso alcanza una
 * prop opcional: no hay una rama por sección.
 */
function TeamSubsection({
  id,
  label,
  lead,
  paragraphs,
  showSlide = false,
}: {
  /** El número de la sección (`01`, `02`, `03`); es rótulo, no comportamiento. */
  id: string;
  label: string;
  /**
   * Párrafo con énfasis intra-línea, partido en tres: lo de antes, los nombres
   * y lo de después. Hoy solo lo lleva la sección `01`. Los espacios de los
   * extremos viven en los strings, así que la puntuación se escribe literal.
   */
  lead?: readonly [string, string, string];
  paragraphs: readonly string[];
  showSlide?: boolean;
}) {
  const { t } = useLocale();
  const teamPhoto = useImageLoad();

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
          <div className="max-w-[1285px] space-y-8 font-body text-[20px] leading-[1.25] text-off-black md:text-[30px]">
            {lead ? (
              <p>
                {lead[0]}
                <strong className="font-medium">{lead[1]}</strong>
                {lead[2]}
              </p>
            ) : null}
            {/*
              `key` por índice y no por texto (§6, contrato 5 del i18n): con el
              texto como clave, cambiar de idioma desmonta y vuelve a montar cada
              `<p>`. Antes de R2 este map usaba el párrafo entero como clave.
            */}
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
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
        <TeamSubsection
          id="01"
          label={t.team.sections[0]}
          lead={t.team.whoWeAre}
          paragraphs={t.team.bio}
          showSlide
        />
        <TeamSubsection
          id="02"
          label={t.team.sections[1]}
          paragraphs={t.team.approach}
        />
        <TeamSubsection
          id="03"
          label={t.team.sections[2]}
          paragraphs={t.team.headed}
        />
      </div>
    </main>
  );
}
