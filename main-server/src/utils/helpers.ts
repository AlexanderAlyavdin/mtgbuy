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

export interface IAdvancedQuery {
  elem(): Element | undefined;
  textAsInt(): number | undefined;
  text(): string | undefined;
  href(): string | undefined;
}

export class ConfigItem<T extends keyof IAdvancedQuery> {
  type: T;
  selector: string;
  constructor(selector: string, type: T) {
    this.selector = selector;
    this.type = type;
  }
}

export interface IConfig {
  [key: string]: ConfigItem<keyof IAdvancedQuery>;
}

export type ModifiedQuery<T extends IConfig> = {
  readonly [ Prop in keyof T]: IAdvancedQuery[T[Prop]['type']];
}

export const queryConcrete = <T extends IConfig>(config: T) => {
  return (root: Element | Document) => {
    const modifiedQuery = {};
    const keys = Object.keys(config) as Array<keyof T>;
    keys.forEach(key => {
      const selector = config[key].selector;
      const action = config[key].type;
      Object.defineProperty(modifiedQuery, key, {
        value: () => query(root, selector)[action](),
      });
    });
    return modifiedQuery as ModifiedQuery<T>;
  };
};

export const query = (root: Element | Document, selector: string): IAdvancedQuery => {
  const element = root.querySelector(selector);
  return {
    elem: () => element,
    textAsInt: () => element && parseInt(cleanupString(element.textContent)),
    text: () => element && cleanupString(element.textContent),
    href: () => element && element.getAttribute('href'),
  };
};

export const queryAll = (root: Element | Document, selector: string) => Array.from(root.querySelectorAll(selector));

export default { cleanupString, queryAndGetAttr, queryAndGetText };
