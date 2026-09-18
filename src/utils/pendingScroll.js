/**
 * Замена `navigate("/", { state: { scrollTo } })` из react-router.
 *
 * App Router не умеет носить произвольный state вместе с переходом, а менять
 * ради этого URL не хочется — цель прокрутки просто кладётся сюда перед
 * router.push("/") и забирается эффектом главной страницы.
 */

let pendingScroll = null;

export function setPendingScroll(sectionId) {
  pendingScroll = sectionId || null;
}

/** Возвращает цель и тут же её сбрасывает — прокрутка нужна ровно один раз. */
export function consumePendingScroll() {
  const target = pendingScroll;
  pendingScroll = null;
  return target;
}
