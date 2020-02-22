# mtgbuy
Аггрегатор для российского сегмента торговли картами Magic the Gathering

For collaborations: use yarn instead of npm as js package manager.

Initial shops: mtgtrade.net, mtgsale.ru

Idea: use XParh for HTML parsing. Both of the shops use frontend-less
configuration and just spit html out.

Also it's possible to use https://developer.mozilla.org/ru/docs/Web/API/DOMParser for HTML-parsing - just render
the page as a dom and then use document.querySelector
