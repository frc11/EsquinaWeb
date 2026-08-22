"use client";

import { useLocale } from "@/lib/i18n";

/**
 * Pantallas de error y de vacío de la galería. Vivían dentro de
 * `fun-gallery/page.tsx`, que es un componente de **servidor** y por lo tanto
 * siempre rinde inglés; se sacan a un componente de cliente para que sigan al
 * idioma. La página conserva la decisión —qué pantalla corresponde— y este
 * componente solo pone el texto.
 *
 * La composición no cambia: sigue siendo una sección más del flujo que reserva
 * una pantalla de alto para no quedar pegada al header, con el Footer debajo
 * como en cualquier ruta.
 */
export default function GalleryNotice({
  variant,
}: {
  variant: "error" | "empty";
}) {
  const { t } = useLocale();
  const heading =
    variant === "error" ? t.gallery.errorTitle : t.gallery.emptyTitle;
  const detail =
    variant === "error" ? t.gallery.errorDetail : t.gallery.emptyDetail;

  return (
    <section className="flex min-h-[60svh] w-full items-center justify-center bg-off-white px-6 py-20 text-center text-off-black md:py-32">
      <div className="max-w-2xl">
        <h1 className="font-display text-[26px] uppercase leading-[31px] md:text-[40px] md:leading-[48px]">
          {heading}
        </h1>
        <p className="mt-6 font-body text-[17px] uppercase leading-[21px] text-gray-brand">
          {detail}
        </p>
      </div>
    </section>
  );
}
