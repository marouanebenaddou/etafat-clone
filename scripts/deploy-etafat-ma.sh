#!/usr/bin/env bash
# Upload site-www/ (built by: node scripts/build-site-export.mjs) to etafat.ma over FTP + TLS.
#   FTP_USER=<ftp login> scripts/deploy-etafat-ma.sh list      # show what is on the server (read-only)
#   FTP_USER=<ftp login> scripts/deploy-etafat-ma.sh dry-run   # show what an upload would send (read-only)
#   FTP_USER=<ftp login> scripts/deploy-etafat-ma.sh upload    # send the site
# lftp asks for the password at its own prompt: it is never stored, logged or put on a command line.
# Nothing on the server is ever deleted (no `mirror --delete`): the hosting's sauvegarde/ folder and every other
# existing file stay as they are; only files with the same name as ours are replaced. Before uploading, the
# server's current .htaccess and index.html are saved to deploy-backups/<date>/ so the switch can be undone.
# Assets go up first and pages last (.html, the .txt navigation payloads, .htaccess), so the live site never
# points at files that are not there yet.
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-}"
HOST="${FTP_HOST:-serveur131.heberjahiz.com}" # etafat.ma's server (same IP); its TLS certificate is issued to this name
DIR="${FTP_DIR:-public_html}"
SRC="site-www"
if [[ -z "${FTP_USER:-}" || ! "$MODE" =~ ^(list|dry-run|upload)$ ]]; then sed -n '2,5p' "$0"; exit 1; fi
[[ -f "$SRC/index.html" ]] || { echo "site-www/ is missing — run: node scripts/build-site-export.mjs"; exit 1; }
[[ ! -e "$SRC/sauvegarde" ]] || { echo "refusing: site-www/ contains a 'sauvegarde' entry"; exit 1; }

# encrypted login and transfers, certificate checked; patient with a shared host
SETTINGS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate true; set ftp:passive-mode true;
set net:timeout 30; set net:max-retries 3; set net:reconnect-interval-base 5; set mirror:parallel-transfer-count 4"
OPEN="open -u \"$FTP_USER\" \"ftp://$HOST\""
PAGES="--include '\\.(html|txt)\$' --include '(^|/)\\.htaccess\$'"
ASSETS="--exclude '\\.(html|txt)\$' --exclude '(^|/)\\.htaccess\$'"

case "$MODE" in
  list)
    lftp -c "$SETTINGS; $OPEN; echo '== /'; cls -la; echo; echo '== $DIR/'; cls -la '$DIR/'"
    ;;
  dry-run)
    # mirror --script writes the planned commands to a file without running them (and lftp's password prompt
    # stays on screen, which capturing its output would hide)
    a=$(mktemp); p=$(mktemp); trap 'rm -f "$a" "$p"' EXIT
    lftp -c "$SETTINGS; set cmd:fail-exit true; $OPEN; mirror -R --script='$a' --no-perms --ignore-time $ASSETS '$SRC' '$DIR'; mirror -R --script='$p' --no-perms $PAGES '$SRC' '$DIR'"
    files=$(cat "$a" "$p" | grep -E '^(put|get) ' | sed -E "s#.*$SRC/##" || true)
    echo "$files" | awk -F/ 'NF { print ($2 == "" ? $1 : $1 "/") }' | sort | uniq -c | sort -rn | sed -n '1,30p'
    echo "→ $(echo "$files" | grep -c . || true) files would be sent to $DIR/ (nothing is ever deleted)"
    ;;
  upload)
    bk="deploy-backups/$(date +%Y-%m-%d_%H%M%S)"; mkdir -p "$bk"
    lftp -c "$SETTINGS; $OPEN;
      set cmd:fail-exit false; get -O '$bk' '$DIR/.htaccess' '$DIR/index.html';
      set cmd:fail-exit true;
      echo '▶ assets…'; mirror -R --no-perms --ignore-time --verbose=1 $ASSETS '$SRC' '$DIR';
      echo '▶ pages…';  mirror -R --no-perms --verbose=1 $PAGES '$SRC' '$DIR'"
    echo "✓ Uploaded. Previous .htaccess / index.html (if any) saved in $bk/ — check https://etafat.ma/"
    ;;
esac
