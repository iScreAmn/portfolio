let pendingScroll = null;

export function setPendingScroll(sectionId) {
  pendingScroll = sectionId || null;
}

export function consumePendingScroll() {
  const target = pendingScroll;
  pendingScroll = null;
  return target;
}
