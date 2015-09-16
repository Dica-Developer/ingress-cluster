import React from 'react'
import { Grid } from 'react-bootstrap'
import { RouteHandler } from 'react-router'

export default class AppContainer extends React.Component {

    render() {
        return (
            <Grid fluid>
                <RouteHandler />
            </Grid>
        )
    }

}

