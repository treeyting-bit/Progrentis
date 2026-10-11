#!/usr/bin/env bash
# Bloquea sitios para adultos en todo el equipo editando /etc/hosts.
# Uso:  sudo ./bloquear-linux-mac.sh            (activar)
#       sudo ./bloquear-linux-mac.sh --quitar   (desactivar)
set -euo pipefail

HOSTS=/etc/hosts
LISTA="$(cd "$(dirname "$0")" && pwd)/../extension/dominios.txt"
INICIO="# >>> BLOQUEADOR-ADULTOS >>>"
FIN="# <<< BLOQUEADOR-ADULTOS <<<"

if [ "$(id -u)" -ne 0 ]; then echo "Ejecuta con sudo."; exit 1; fi

cp "$HOSTS" "$HOSTS.respaldo"
# Quita un bloque anterior, si existe.
sed -i.tmp "/$INICIO/,/$FIN/d" "$HOSTS" && rm -f "$HOSTS.tmp"

if [ "${1:-}" != "--quitar" ]; then
  {
    echo "$INICIO"
    # Búsqueda Segura forzada (Google, YouTube, Bing).
    echo "216.239.38.120 www.google.com"
    echo "216.239.38.120 www.youtube.com m.youtube.com youtubei.googleapis.com"
    echo "204.79.197.220 www.bing.com"
    grep -v '^\s*#' "$LISTA" | grep '\.' | while read -r d; do
      [ -n "$d" ] && echo "0.0.0.0 $d www.$d"
    done
    echo "$FIN"
  } >> "$HOSTS"
  echo "Bloqueo activado."
else
  echo "Bloqueo desactivado."
fi

# Limpia la caché DNS.
if command -v dscacheutil >/dev/null; then dscacheutil -flushcache; killall -HUP mDNSResponder || true
elif command -v resolvectl >/dev/null; then resolvectl flush-caches || true; fi
