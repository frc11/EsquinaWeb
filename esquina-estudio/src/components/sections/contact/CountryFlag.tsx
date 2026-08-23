import { COUNTRY_FLAG_CODES } from "@/components/sections/contact/countryFlagCodes";
import type { CountryOption } from "@/lib/contact";

/*
  LA BANDERA DEL SELECTOR DE PAÍSES
  ─────────────────────────────────
  Sirve el SVG real que vive en `public/flags/` (set vendorizado; fuente,
  versión y licencia en `docs/banderas-set.md`). Reemplaza al set dibujado a
  mano que B4d retiró: con 38 patrones geométricos para 196 países había un 15 %
  directamente mal y otro 25 % apenas reconocible, y eso no se arregla dibujando
  mejor —un escudo no entra en 16 px de alto con geometría genérica—.

  **Gris en reposo, color en hover.** Es un filtro CSS sobre un solo archivo, no
  dos archivos ni dos elementos apilados: `grayscale` de base y `grayscale-0` en
  el disparador que le pasa el consumidor. La transición es la misma que tenía
  el set anterior —150 ms— para que el gesto se sienta igual.

  **Quién dispara el color lo decide el consumidor**, no este componente: en la
  lista es el `group` de la fila y en el valor elegido es el
  `group/contact-focus` del campo. Por eso el disparador entra por `className`
  como literal entero (Tailwind v4 los busca como texto) y acá adentro solo vive
  lo que no cambia: el archivo, la caja y el gris.

  **La caja mide 24 × 15 y no se mueve** (§2.3 de la instrucción de B4d): de
  esos 24 px depende que el rótulo más largo siga teniendo sus 302 px y no se
  recorte. El archivo es 4:3, así que entra con `object-cover` —recorta 1,5 px
  arriba y 1,5 abajo de los 18 a los que escala— y **nunca estirado**. El
  `width`/`height` va también como atributo: reserva el lugar antes de que la
  imagen llegue, así la lista no salta mientras cargan.

  **`loading="lazy"` no es un adorno.** El desplegable monta las 196 filas de
  una, y sin diferir la carga abrirlo dispararía 196 descargas. Con el atributo
  puesto el navegador pide solo las que están a la vista dentro del contenedor
  con scroll.

  Decorativa: `alt=""` la saca del árbol de accesibilidad. El nombre del país ya
  está en el texto de la fila —y en el nombre accesible del disparador, vía
  `aria-labelledby`—, así que anunciarla sería decir el país dos veces.
*/
export default function CountryFlag({
  country,
  className = "",
}: {
  country: string;
  /** Variante que devuelve el color: la escribe quien conoce el `group`. */
  className?: string;
}) {
  const code: string | undefined = COUNTRY_FLAG_CODES[country as CountryOption];
  if (!code) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code}.svg`}
      alt=""
      width={24}
      height={15}
      loading="lazy"
      decoding="async"
      className={`h-[15px] w-[24px] shrink-0 object-cover grayscale transition-[filter] duration-150 motion-reduce:transition-none ${className}`}
    />
  );
}
