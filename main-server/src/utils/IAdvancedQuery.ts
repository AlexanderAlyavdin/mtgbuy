export interface IAdvancedQuery {
  readonly elem: Element | undefined;
  readonly textAsInt: number | undefined;
  readonly text: string | undefined;
  readonly href: string | undefined;
  getAttribute: (attrName: string) => string | undefined;
}
