import * as React from "react";

/**
 * Tracks whether the viewport is narrow enough for the sidebar to become a
 * drawer instead of a fixed column.
 *
 * Rewritten from the shadcn default, which set state inside an effect. That
 * pattern trips this project's `react-hooks/set-state-in-effect` rule, and the
 * rule has a point: it renders once with the wrong answer, then again with the
 * right one. `useSyncExternalStore` is React's own API for reading an external
 * source like `matchMedia`, so the first render already has the correct value
 * and there is no second pass.
 *
 * Re-running `npx shadcn add sidebar` will offer to overwrite this file. Say no.
 */
const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onStoreChange);

  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * The server has no viewport to measure. Answering "not mobile" is the safer
 * default: the sidebar then renders as a plain column in the initial HTML
 * rather than as an overlay that would flash open before hydration.
 */
function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
