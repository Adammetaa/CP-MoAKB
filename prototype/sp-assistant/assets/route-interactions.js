export function findOwnedRouteTarget(eventTarget, root) {
  const routeTarget = eventTarget?.closest?.("[data-route]") ?? null;
  return routeTarget && root.contains(routeTarget) ? routeTarget : null;
}
