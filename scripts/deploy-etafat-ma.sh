#!/usr/bin/env bash
# Upload site-www/ (built by: node scripts/build-site-export.mjs) to etafat.ma over FTP + TLS.
#   scripts/deploy-etafat-ma.sh list      # show what is on the server (read-only)
#   scripts/deploy-etafat-ma.sh dry-run   # show what an upload would send (read-only)
#   scripts/deploy-etafat-ma.sh upload    # send the site   (npm run deploy:etafat-ma = build + upload)
# Credentials stay out of this (public) repo. Login: $FTP_USER, else the account of the macOS Keychain item for the
# server. Password: that Keychain item (handed to lftp through LFTP_PASSWORD, never on a command line or in a log),
# else lftp asks at its own prompt. One-time Keychain setup — macOS prompts for the password (-w must stay last):
#   security add-internet-password -s serveur131.heberjahiz.com -a <ftp login> -w
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
if [[ -z "${FTP_USER:-}" ]] && command -v security >/dev/null; then
  FTP_USER=$(security find-internet-password -s "$HOST" 2>/dev/null | sed -n 's/^ *"acct"<blob>="\(.*\)"$/\1/p' | head -1)
fi
if [[ -z "${FTP_USER:-}" || ! "$MODE" =~ ^(list|dry-run|upload)$ ]]; then sed -n '2,10p' "$0"; exit 1; fi
[[ -f "$SRC/index.html" ]] || { echo "site-www/ is missing — run: node scripts/build-site-export.mjs"; exit 1; }
[[ ! -e "$SRC/sauvegarde" ]] || { echo "refusing: site-www/ contains a 'sauvegarde' entry"; exit 1; }

# encrypted login and transfers, certificate checked; patient with a shared host
SETTINGS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate true; set ftp:passive-mode true;
set net:timeout 30; set net:max-retries 3; set net:reconnect-interval-base 5; set mirror:parallel-transfer-count 4"
OPEN="open -u \"$FTP_USER\" \"ftp://$HOST\""
if command -v security >/dev/null && LFTP_PASSWORD=$(security find-internet-password -s "$HOST" -a "$FTP_USER" -w 2>/dev/null); then
  export LFTP_PASSWORD; OPEN="open --user \"$FTP_USER\" --env-password \"ftp://$HOST\""
else
  unset LFTP_PASSWORD
fi
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
    lftp -c "$SETTINGS; set cmd:fail-exit true; $OPEN; cd '$DIR'; mirror -R --script='$a' --no-perms --ignore-time $ASSETS '$SRC' .; mirror -R --script='$p' --no-perms $PAGES '$SRC' ."
    files=$(cat "$a" "$p" | grep -E '^(put|get) ' | sed -E "s#.*$SRC/##" || true)
    echo "$files" | awk -F/ 'NF { print ($2 == "" ? $1 : $1 "/") }' | sort | uniq -c | sort -rn | sed -n '1,30p'
    echo "→ $(echo "$files" | grep -c . || true) files would be sent to $DIR/ (nothing is ever deleted)"
    ;;
  upload)
    bk="deploy-backups/$(date +%Y-%m-%d_%H%M%S)"; mkdir -p "$bk"
    # `cd` logs in first: a wrong password stops the script there (no further attempts that the host's
    # brute-force protection would count)
    lftp -c "$SETTINGS; set cmd:fail-exit true; $OPEN; cd '$DIR';
      set cmd:fail-exit false; get -O '$bk' .htaccess index.html;
      set cmd:fail-exit true;
      echo '▶ assets…'; mirror -R --no-perms --ignore-time --verbose=1 $ASSETS '$SRC' .;
      echo '▶ pages…';  mirror -R --no-perms --verbose=1 $PAGES '$SRC' ."
    echo "✓ Uploaded. Previous .htaccess / index.html (if any) saved in $bk/ — check https://etafat.ma/"
    ;;
esac
