/**
 * Banco de medición — cliente mínimo del DevTools Protocol.
 *
 * Chrome `--headless=new` manejado por CDP sobre el `WebSocket` nativo de Node.
 * Sin dependencias: el repo no suma paquetes para medirse a sí mismo (§8.2 de
 * CLAUDE.md). Es la quinta reconstrucción de este banco —M2, M3, M4, M6 y R2—;
 * la de R2 dejó de ser desechable y vive acá.
 *
 * Por qué headless y no la pestaña visible: Chrome no corre `requestAnimationFrame`
 * con la pestaña oculta y estrangula los temporizadores. En headless la página se
 * pinta de verdad, así que las animaciones se pueden observar (§7b de CLAUDE.md).
 */

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Con barras normales: Node las acepta en Windows y así el literal no depende de
// escapes que un editor o un heredoc puedan comerse.
const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  for (const candidate of CHROME_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("No encontré Chrome. Definí CHROME_PATH.");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Levanta Chrome headless y devuelve un cliente conectado al target de browser.
 * El puerto se pide en 0 y se lee del `DevToolsActivePort` que Chrome escribe en
 * su perfil: pedir un puerto fijo es lo que hace que dos corridas se pisen.
 */
export async function launchChrome() {
  const chrome = findChrome();
  const profile = mkdtempSync(join(tmpdir(), "esquina-bench-"));

  const child = spawn(
    chrome,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-features=TranslateUI,MediaRouter",
      "--force-device-scale-factor=1",
      "--mute-audio",
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
  );

  const portFile = join(profile, "DevToolsActivePort");
  let port = null;
  for (let i = 0; i < 200 && port === null; i += 1) {
    await sleep(50);
    if (!existsSync(portFile)) continue;
    const raw = readFileSync(portFile, "utf8").split("\n");
    if (raw[0] && raw[0].trim()) port = Number(raw[0].trim());
  }
  if (port === null) {
    child.kill();
    throw new Error("Chrome no publicó su puerto de depuración.");
  }

  const version = await (
    await fetch(`http://127.0.0.1:${port}/json/version`)
  ).json();

  const client = await connect(version.webSocketDebuggerUrl);
  client.close = async () => {
    try {
      client.socket.close();
    } catch {
      /* el socket ya estaba cerrado */
    }
    child.kill();
    await sleep(300);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* el perfil queda en el temporal del sistema; no es un fallo de medición */
    }
  };
  return client;
}

/** Cliente CDP: `send(method, params, sessionId)` y suscripción por evento. */
async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== undefined && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }
    for (const listener of listeners) listener(message);
  });

  return {
    socket,
    send(method, params = {}, sessionId) {
      const id = (nextId += 1);
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      socket.send(JSON.stringify(payload));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    on(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /** Espera un evento con `sessionId` propio; resuelve con sus `params`. */
    once(method, sessionId, timeoutMs = 30000) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          off();
          reject(new Error(`Timeout esperando ${method}`));
        }, timeoutMs);
        const off = this.on((message) => {
          if (message.method !== method) return;
          if (sessionId && message.sessionId !== sessionId) return;
          clearTimeout(timer);
          off();
          resolve(message.params);
        });
      });
    },
  };
}

export { sleep };
