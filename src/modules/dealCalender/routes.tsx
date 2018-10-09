import queryString from 'query-string';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { CalenderView } from './containers';

const routes = () => (
  <Route
    exact
    path="/test"
    component={({ location }) => {
      const queryParams = queryString.parse(location.search);

      return <CalenderView queryParams={queryParams} />;
    }}
  />
);

export default routes;
