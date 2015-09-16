import React from 'react'
import { Route, DefaultRoute } from 'react-router'
import AppContainer from '../containers/AppContainer'
import HomePageContainer from '../containers/HomePageContainer'


export default (
  <Route path="/" handler={AppContainer}>
    <DefaultRoute name="home" handler={HomePageContainer} />
  </Route>
)
