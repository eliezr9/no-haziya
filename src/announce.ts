/** Screen-reader announcement through the page's single polite live region (#live). */
export function announce(text: string): void {
  const live = document.getElementById('live');
  if (live) live.textContent = text;
}
