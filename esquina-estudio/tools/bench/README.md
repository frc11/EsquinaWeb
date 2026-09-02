# Banco de medición

Chrome `--headless=new` por DevTools Protocol sobre el `WebSocket` nativo de Node: sin dependencias nuevas, y se mide sobre `npm run build` + `next start -p 3010`, nunca sobre `next dev`.
`cdp.mjs` levanta y conecta el navegador · `page.mjs` es una pestaña con viewport, idioma sembrado y espera de imágenes · `server.mjs` levanta y baja el servidor **por PID** · `baseline.mjs` produce la vara de no-regresión (48 altos, scroll horizontal, fit del formulario).
Se corre desde `esquina-estudio/`: `node tools/bench/baseline.mjs > docs/archivo/mediciones/<nombre>.json`.
Se trackea a propósito: hasta R2 se reconstruía en cada sprint —van cinco veces— y cada reconstrucción volvió a equivocarse en las mismas tres cosas (idioma sembrado tarde, cortina del preloader sin saltear, imágenes sin decodificar).
