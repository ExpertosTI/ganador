#!/usr/bin/env bash
# ── EL OJO GANADOR — Universal Deployment Script (Docker Swarm + PM2 + Traefik) ──
#  Dominio: https://elojoganador.com (y www.elojoganador.com)
#  Uso en el VPS:
#      cd /var/www/ganador && bash deploy.sh

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/var/www/ganador}"
REPO_URL="${REPO_URL:-https://github.com/ExpertosTI/ganador.git}"
STACK_NAME="${STACK_NAME:-ganador}"
PM2_APP_NAME="${PM2_APP_NAME:-ganador}"

cyan()  { printf "\033[36m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
red()   { printf "\033[31m%s\033[0m\n" "$*"; }

cyan "⚡ ── [EL OJO GANADOR] Iniciando Despliegue Universal (elojoganador.com) ──"

# ── 1. Asegurar directorio y respaldar variables locales ──────
if [ ! -d "$PROJECT_DIR" ]; then
  cyan "Clonando repositorio en $PROJECT_DIR..."
  git clone "$REPO_URL" "$PROJECT_DIR" || mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Limpiar respaldos temporales antiguos para liberar espacio en disco
rm -rf /tmp/ganador_backup_* 2>/dev/null || true

# Respaldar .env y archivos de base de datos persistentes (*.json)
BACKUP_DIR="/tmp/ganador_backup_$(date +%s)"
mkdir -p "$BACKUP_DIR"
mkdir -p "$PROJECT_DIR/server/data"

if [ -f "$PROJECT_DIR/.env" ]; then
  cp "$PROJECT_DIR/.env" "$BACKUP_DIR/.env"
fi
if [ -d "$PROJECT_DIR/server/data" ]; then
  mkdir -p "$BACKUP_DIR/data"
  cp -r "$PROJECT_DIR/server/data/"* "$BACKUP_DIR/data/" 2>/dev/null || true
fi

# ── 2. Sincronización limpia con GitHub (si está configurado git remote) ──
if git remote >/dev/null 2>&1; then
  cyan "── 1. Sincronizando fuente desde GitHub ──────"
  git fetch origin main || true
  git reset --hard origin/main || true
  git clean -fd -e .env -e server/data || true
fi

# ── 3. Restaurar variables locales de producción ───────────────
cyan "── 2. Preservando variables y estado local ───"
if [ -f "$BACKUP_DIR/.env" ]; then
  cp "$BACKUP_DIR/.env" "$PROJECT_DIR/.env"
  green "✔ .env local preservado correctamente."
fi

if [ -d "$BACKUP_DIR/data" ] && [ "$(ls -A "$BACKUP_DIR/data" 2>/dev/null)" ]; then
  mkdir -p "$PROJECT_DIR/server/data"
  cp -r "$BACKUP_DIR/data/"* "$PROJECT_DIR/server/data/" 2>/dev/null || true
  green "✔ Base de datos local (órdenes, catálogo, historias) preservada."
fi

# Permisos completos para que el contenedor Docker y PM2 puedan escribir sin trabas
chmod -R 777 "$PROJECT_DIR/server/data" 2>/dev/null || true
rm -rf "$BACKUP_DIR" 2>/dev/null || true

# ── 4. Compilación del Frontend en el Host (Vite Multi-Page) ──
cyan "── 3. Compilando bundle de producción (Vite) ──"
npm install --no-audit --no-fund
npm run build
green "✔ Bundle multi-página compilado exitosamente en dist/ (index, catalogo, subir-fotos, subir-historias)."

# ── 5. Construir imagen Docker limpia y Desplegar en Traefik ──
if command -v docker >/dev/null 2>&1; then
  cyan "── 4. Construyendo imagen Docker (Node 20 Slim) ──"
  docker build -t ganador:latest .

  cyan "── 5. Verificando red compartida Traefik (RenaceNet) ──"
  if ! docker network ls --format '{{.Name}}' | grep -qx "RenaceNet"; then
    docker network create --driver overlay --attachable RenaceNet 2>/dev/null || docker network create RenaceNet || true
  fi

  # Detectar si Swarm está activo o usar docker compose
  IS_SWARM=false
  if docker node ls >/dev/null 2>&1 || docker stack ls >/dev/null 2>&1 || docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -qi "active"; then
    IS_SWARM=true
  fi

  if [ "$IS_SWARM" = "true" ]; then
    cyan "── 6. Desplegando en Docker Swarm con Traefik ──"
    docker stack deploy --resolve-image never -c docker-compose.yml "$STACK_NAME"
    docker service update --force --image ganador:latest "${STACK_NAME}_ganador" 2>/dev/null || true
    sleep 3
    docker service ps "${STACK_NAME}_ganador" --no-trunc 2>/dev/null || true
    green "✔ Servicio Swarm '${STACK_NAME}_ganador' enlazado a Traefik en elojoganador.com."
  else
    cyan "── 6. Desplegando con Docker Compose estándar + Traefik ──"
    docker compose up -d --build --remove-orphans || {
      yellow "Aviso: Reintentando despliegue directo con Docker Swarm Stack..."
      docker stack deploy --resolve-image never -c docker-compose.yml "$STACK_NAME"
    }
    green "✔ Contenedor ganador enlazado con Traefik en elojoganador.com."
  fi
fi

# ── 7. Actualizar Proceso PM2 (Opcional si corre sin Docker) ──
if command -v pm2 >/dev/null 2>&1 && [ "${USE_PM2:-false}" = "true" ]; then
  cyan "── 7. Sincronizando proceso PM2 en host ────────"
  if pm2 list | grep -qw "$PM2_APP_NAME"; then
    pm2 restart "$PM2_APP_NAME" --update-env
  else
    pm2 start server/server.js --name "$PM2_APP_NAME"
  fi
  pm2 save --force >/dev/null 2>&1 || true
  green "✔ PM2 '$PM2_APP_NAME' sincronizado."
fi

chmod +x "$PROJECT_DIR/deploy.sh" 2>/dev/null || true

green ""
green "================================================================"
green "✅ ¡Despliegue de EL OJO GANADOR completado con éxito!"
green "   🌐 Dominio Principal: https://elojoganador.com"
green "   📦 Catálogo Pro:      https://elojoganador.com/catalogo.html"
green "   ⚡ Cotizador Rápido:  https://elojoganador.com/?cotizador=1"
green "   📸 Subir Fotos:       https://elojoganador.com/subir-fotos.html"
green "   🎬 Subir Historias:   https://elojoganador.com/subir-historias.html"
green "   🔐 Panel Admin CMS:   https://elojoganador.com/?admin=1"
green "================================================================"
