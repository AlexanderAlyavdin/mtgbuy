import React, { FunctionComponent, useEffect, useState } from 'react';

import getHtmlByCardName from '../utils/parsers/mtgsale-parser-copy';

import makeBem from '../utils/make-bem';
import { JSDOM } from 'jsdom';

const { mainClass } = makeBem('TestRoute');

const TestRoute: FunctionComponent = () => {
  const [htmlResult, setHtmlResult] = useState(new JSDOM('<div></div>'));

  useEffect(() => {
    (async (): Promise<void> => setHtmlResult(await getHtmlByCardName('golos')))();
  }, []);

  return <div className={mainClass}>{htmlResult.window.document.textContent}</div>;
};

export default TestRoute;
