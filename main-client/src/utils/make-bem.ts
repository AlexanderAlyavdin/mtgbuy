export interface BemSetupObject {
  mainClass: string;
  bem: (elementName: string) => string;
}

const makeBem = (blockName: string): BemSetupObject => {
  return {
    mainClass: blockName,
    bem: (elementName: string): string => {
      return `${blockName}__${elementName}`;
    },
  };
};

export default makeBem;
