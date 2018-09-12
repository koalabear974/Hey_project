import React from 'react';
import { Router, Route, Link } from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory';

import Header from '../../imports/ui/Header/Header.js';
import App from '../../imports/ui/App.js';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => {
  return (
    <Router history={browserHistory}>
      <div className='main__container'>
        <Header />
        {/*<Route path="/" component={App}/>*/}
      </div>
    </Router>
  );
}
      //<Route exact path="/lists/:id" component={ListPageContainer}/>
      //<Route exact path="/signin" component={AuthPageSignIn}/>
      //<Route exact path="/join" component={AuthPageJoin}/>
      //<Route component={NotFoundPage}/>
