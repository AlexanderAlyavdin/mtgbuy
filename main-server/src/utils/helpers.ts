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

export const query = (root: Element | Document, selector: string) => {
  const element = root.querySelector(selector);
  return {
    get elem() {
      return element;
    },
    get textAsInt() {
      return element && parseInt(cleanupString(element.textContent));
    },
    get text() {
      return element && cleanupString(element.textContent);
    },
    get href() {
      return element && element.getAttribute('href');
    },
    getAttribute(attrName: string) {
      return element && element.getAttribute(attrName);
    },
  };
};

export const queryAll = (root: Element | Document, selector: string) => Array.from(root.querySelectorAll(selector));

export default { cleanupString, queryAndGetAttr, queryAndGetText };
