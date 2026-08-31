# Resolve the Chrome binary and echo its path. Sourced by render.sh and
# measure.sh so both agree on which browser they are driving.
#
#   CHROME=/path/to/chrome ./render.sh     # override
#
# Chrome specifically, not "any browser": these panels are laid out with flexbox
# and percentage-positioned map pins, and Chrome's --print-to-pdf is the only
# engine here that paginates them the same way the browser preview did. A
# different engine will render, but not identically, and the difference shows up
# at 48 inches.
_chrome_resolve() {
  if [ -n "${CHROME:-}" ]; then
    command -v "$CHROME" >/dev/null 2>&1 || [ -x "$CHROME" ] || {
      echo "CHROME is set to '$CHROME', which is not an executable." >&2
      return 1
    }
    printf '%s' "$CHROME"
    return 0
  fi
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    google-chrome google-chrome-stable chromium chromium-browser
  do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then
      printf '%s' "$c"
      return 0
    fi
  done
  echo "Could not find Google Chrome. Install it, or point CHROME at the binary:" >&2
  echo "  CHROME=/path/to/chrome $0 ..." >&2
  return 1
}
_chrome_resolve
