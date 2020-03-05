const cleanupString = (text: string): string => {
  return text
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s\s+/g, ' ')
    .trim();
};

const queryAndGetAttr = (item: HTMLElement, selector: string, attr: string): string => {
  const elem = item.querySelector(selector);
  return elem && elem.getAttribute(attr);
};

const queryAndGetText = (item: HTMLElement, selector: string): string => {
  const elem = item.querySelector(selector);
  return elem && cleanupString(elem.textContent);
};

export default { cleanupString, queryAndGetAttr, queryAndGetText };
