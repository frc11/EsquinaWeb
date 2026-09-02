/**
 * Banco de medición — el servidor de producción.
 *
 * Se mide sobre `npm run build` + `next start`, nunca sobre `next dev`: es lo que
 * ve el visitante. El puerto por convención es **3010**; el 3000 lo ocupa un
 * proyecto ajeno y no se toca. El proceso se baja **por PID** —`taskkill /T` en
 * Windows para llevarse el árbol—, nunca por nombre de imagen.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { sleep } from "./cdp.mjs";

export const PORT = 3010;
export const ORIGIN = `http://127.0.0.1:${PORT}`;

export async function startServer({ cwd = process.cwd(), port = PORT } = {}) {
  const bin = join(cwd, "node_modules", "next", "dist", "bin", "next");
  if (!existsSync(bin)) throw new Error(`No encontré ${bin}`);

  const child = spawn(process.execPath, [bin, "start", "-p", String(port)], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let log = "";
  child.stdout.on("data", (chunk) => (log += chunk));
  child.stderr.on("data", (chunk) => (log += chunk));

  const origin = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 300; i += 1) {
    await sleep(200);
    try {
      const response = await fetch(origin, { redirect: "manual" });
      if (response.status < 500) {
        return { child, origin, stop: () => stop(child) };
      }
    } catch {
      /* todavía no escucha */
    }
    if (child.exitCode !== null) {
      throw new Error(`El servidor murió antes de escuchar:\n${log}`);
    }
  }
  stop(child);
  throw new Error(`El servidor no escuchó en 60 s:\n${log}`);
}

function stop(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else {
    child.kill("SIGTERM");
  }
}
