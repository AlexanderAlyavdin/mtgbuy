export const cleanupString = (text: string): string => {
  return text
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s\s+/g, ' ')
    .trim();
};

export const queryAndGetAttr = (item: Element, selector: string, attr: string): string => {
  const elem = item.querySelector(selector);
  return elem && elem.getAttribute(attr);
};

export const queryAndGetText = (item: Element, selector: string): string => {
  const elem = item.querySelector(selector);
  return elem && cleanupString(elem.textContent);
};

export default { cleanupString, queryAndGetAttr, queryAndGetText };
