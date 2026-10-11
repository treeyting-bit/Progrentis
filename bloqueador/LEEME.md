# Bloqueador de contenido adulto

Tiene dos partes. Para mejor protección, usa las dos.

## 1. Extensión de navegador (Chrome, Edge, Brave, Opera)

Qué hace:
- Bloquea más de 60 sitios pornográficos conocidos y los dominios `.xxx`, `.porn`, `.sex` y `.adult`.
- Bloquea cualquier página cuya dirección contenga palabras como *porn*, *xxx* o *hentai*; esto incluye las búsquedas.
- Fuerza la Búsqueda Segura en Google, Bing, DuckDuckGo y Yahoo, y el Modo Restringido en YouTube.
- Muestra una página de ánimo en lugar del sitio.
- En las opciones puedes agregar tus propios dominios.

Cómo instalarla:
1. Abre `chrome://extensions` (en Edge, `edge://extensions`).
2. Activa el **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la carpeta `bloqueador/extension`.
4. En los detalles de la extensión, activa **Permitir en modo incógnito**.

## 2. Bloqueo a nivel de sistema (todos los navegadores y apps)

Este script edita el archivo *hosts* para que los sitios no carguen en ningún programa del equipo.
Antes de cambiarlo, guarda una copia en `hosts.respaldo`.

**Windows**: abre PowerShell como Administrador, entra a la carpeta `bloqueador/sistema` y ejecuta:
```powershell
powershell -ExecutionPolicy Bypass -File .\bloquear-windows.ps1
```

**Mac / Linux**:
```bash
sudo ./bloqueador/sistema/bloquear-linux-mac.sh
```

Para quitarlo, añade `-Quitar` (Windows) o `--quitar` (Mac/Linux).

## Para reforzarlo (recomendado)

- **DNS con filtro familiar**: en la configuración de red de tu equipo o de tu router, pon el DNS `1.1.1.3` y `1.0.0.3` (Cloudflare for Families). Así se bloquean miles de sitios más, también en el celular si lo pones en el router.
- **Celular**: en Android, ve a *Ajustes → Redes → DNS privado* y escribe `family.cloudflare-dns.com`. En iPhone, ve a *Ajustes → Tiempo en pantalla → Restricciones de contenido → Contenido web → Limitar sitios web para adultos*.
- Pídele a alguien de confianza que ponga una contraseña de Tiempo en pantalla o de control parental que tú no conozcas.

Ningún bloqueador es perfecto: con esfuerzo se puede saltar. Funciona mejor como una barrera que te da unos segundos para pensar. Si te cuesta dejarlo, hablar con alguien ayuda mucho.
