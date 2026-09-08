export function formatPageCitation(input: {
  printedPageStart: number | null;
  printedPageEnd: number | null;
  pdfPageStart: number;
  pdfPageEnd: number;
}): string {
  if (input.printedPageStart != null) {
    if (input.printedPageEnd != null && input.printedPageEnd !== input.printedPageStart) {
      return `pp. ${input.printedPageStart}–${input.printedPageEnd}`;
    }
    return `p. ${input.printedPageStart}`;
  }

  if (input.pdfPageEnd !== input.pdfPageStart) {
    return `PDF pp. ${input.pdfPageStart}–${input.pdfPageEnd}`;
  }
  return `PDF p. ${input.pdfPageStart}`;
}

export function formatSourceCitation(input: {
  documentTitle: string;
  heading?: string;
  printedPageStart: number | null;
  printedPageEnd: number | null;
  pdfPageStart: number;
  pdfPageEnd: number;
}): string {
  const pages = formatPageCitation(input);
  if (input.heading) {
    return `${input.documentTitle}, ${input.heading}, ${pages}`;
  }
  return `${input.documentTitle}, ${pages}`;
}
