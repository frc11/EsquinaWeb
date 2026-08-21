import { SERVICES_COPY } from "@/lib/services-content";

/**
 * Intro de `/services`: la frase centrada y, debajo, el indicador de scroll.
 *
 * Ya no hay máquina de estados ni scroll-jack (B3.4/F1): esto es una sección de
 * una pantalla de alto, sin estado, servida desde el servidor. El único
 * comportamiento —el gatillo de un scroll hacia Branding Packs— lo agrega un
 * componente hermano en F4 y no toca este árbol.
 *
 * `↓ DISCOVER OUR SERVICES ↓` **no es un botón**: es una señal de que hay que
 * scrollear. Por eso es un `<p>` y no un link ni un `HoverButton`, no cambia con
 * el hover y no tiene `cursor: pointer`. Las flechas van como texto decorativo,
 * fuera del árbol de accesibilidad, para que un lector de pantalla anuncie la
 * frase y no dos flechas sueltas.
 *
 * El alto es una pantalla **descontando el header fijo**, así que Branding Packs
 * empieza exactamente en el pliegue: el `<main>` del layout ya aporta el
 * `pt-[var(--header-height)]`.
 */
export default function ServicesIntro() {
  const { phrase, scrollHint } = SERVICES_COPY.intro;

  return (
    <section
      id="intro"
      aria-label="Intro"
      className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-col items-center justify-center text-center"
    >
      <p className="max-w-[1000px] font-display text-[40px] uppercase leading-[48px] tracking-normal text-off-black">
        {phrase}
      </p>

      <p className="mt-[48px] flex items-center gap-3 font-body text-[17px] uppercase leading-[20px] text-off-black">
        <span aria-hidden="true">&darr;</span>
        {scrollHint}
        <span aria-hidden="true">&darr;</span>
      </p>
    </section>
  );
}
