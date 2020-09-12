import { Switch, Route, useHistory } from 'react-router-dom';
import React, { FunctionComponent } from 'react';

import SearchHeader from 'routes/single-search/SearchHeader';
import CardSearchData from './CardSearchData';

const SingleSearchRoute: FunctionComponent = () => {
  const history = useHistory();

  const handleSearch = (value: string): void => {
    history.push(`${value}`);
  };

  return (
    <>
      <SearchHeader onSearch={handleSearch} />

      <Switch>
        <Route path='/:cardName'>
          <CardSearchData />
        </Route>
      </Switch>
    </>
  );
};

export default SingleSearchRoute;
