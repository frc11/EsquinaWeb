import {
  SPY_SENTINEL_ATTR,
  SPY_SENTINEL_CLASS,
} from "@/components/sections/services/services-layout";

/**
 * Marca de 1 px pegada al tope de una sección. Es lo que observa el scroll-spy
 * del sidebar: una sección alta sigue intersecando la pantalla mientras su tope
 * cruza la línea de lectura, así que observarla a ella no genera ningún evento;
 * observar esta marca sí.
 *
 * La sección que lo contiene tiene que ser `relative`.
 */
export default function SpySentinel({ id }: { id: string }) {
  const attrs = { [SPY_SENTINEL_ATTR]: id };

  return <span aria-hidden="true" className={SPY_SENTINEL_CLASS} {...attrs} />;
}
