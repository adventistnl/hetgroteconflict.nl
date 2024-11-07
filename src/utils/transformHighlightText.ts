export function highlightText(text: string) {
  return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
}
