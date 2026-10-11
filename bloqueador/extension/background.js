// Bloqueador de contenido adulto: bloqueo por dominio, por palabra clave y Búsqueda Segura forzada.

const BLOCK_PAGE = "/bloqueado.html";

// Palabras que, si aparecen en la URL de una página, la bloquean (incluye búsquedas).
const PALABRAS = [
  "porn", "porno", "xxx", "hentai", "xvideo", "xnxx", "nsfw", "milf",
  "onlyfans", "camgirl", "desnud", "nude", "naked", "sexo-", "sex-video",
  "rule34", "cogiendo", "follando", "culiando", "pack-filtrado"
];

const ID_DOMINIOS = 1;
const ID_YOUTUBE = 2;
const ID_PALABRAS = 100; // 100, 101, ... una regla por palabra

async function leerDominiosBase() {
  const texto = await (await fetch(chrome.runtime.getURL("dominios.txt"))).text();
  return texto
    .split("\n")
    .map((l) => l.trim().toLowerCase())
    .filter((l) => l && !l.startsWith("#"));
}

async function aplicarReglas() {
  const { personalizados = [] } = await chrome.storage.sync.get("personalizados");
  const dominios = [...new Set([...(await leerDominiosBase()), ...personalizados])];

  const reglas = [
    {
      id: ID_DOMINIOS,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: BLOCK_PAGE } },
      condition: { requestDomains: dominios, resourceTypes: ["main_frame", "sub_frame"] }
    },
    ...PALABRAS.map((palabra, i) => ({
      id: ID_PALABRAS + i,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: BLOCK_PAGE } },
      condition: {
        urlFilter: palabra,
        isUrlFilterCaseSensitive: false,
        resourceTypes: ["main_frame", "sub_frame"]
      }
    })),
    {
      // Modo restringido de YouTube.
      id: ID_YOUTUBE,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [{ header: "YouTube-Restrict", operation: "set", value: "Strict" }]
      },
      condition: {
        requestDomains: ["youtube.com", "m.youtube.com", "youtubei.googleapis.com", "youtube-nocookie.com"]
      }
    }
  ];

  const existentes = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existentes.map((r) => r.id),
    addRules: reglas
  });
}

// Búsqueda Segura: si falta el parámetro, recarga la búsqueda con él.
const BUSCADORES = [
  { host: /(^|\.)google\.[a-z.]+$/, ruta: /^\/(search|images)/, param: "safe", valor: "active" },
  { host: /(^|\.)bing\.com$/, ruta: /^\/(search|images|videos)/, param: "adlt", valor: "strict" },
  { host: /(^|\.)duckduckgo\.com$/, ruta: /^\/$/, param: "kp", valor: "1", requiere: "q" },
  { host: /(^|\.)search\.yahoo\.com$/, ruta: /^\/search/, param: "vm", valor: "r" }
];

chrome.webNavigation.onBeforeNavigate.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) return;
  let u;
  try { u = new URL(url); } catch { return; }
  const b = BUSCADORES.find((b) => b.host.test(u.hostname) && b.ruta.test(u.pathname));
  if (!b || (b.requiere && !u.searchParams.has(b.requiere))) return;
  if (u.searchParams.get(b.param) === b.valor) return;
  u.searchParams.set(b.param, b.valor);
  chrome.tabs.update(tabId, { url: u.toString() });
});

chrome.runtime.onInstalled.addListener(aplicarReglas);
chrome.runtime.onStartup.addListener(aplicarReglas);
chrome.storage.onChanged.addListener((cambios) => {
  if (cambios.personalizados) aplicarReglas();
});
