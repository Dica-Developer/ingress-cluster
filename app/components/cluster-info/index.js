import React from 'react'
import {filter, findWhere} from 'lodash';
import template from './cluster-info.rt';

export default React.createClass({

    getInitialState(){
        return {
            clusterNr: null
        }
    },

    render: template,

    _getClusterPortals(){
        let selectedPortal = findWhere(this.props.portals, { 'guid': this.props.selectedPortal}),
            clusterNr, portals;

        if(!selectedPortal){
            return [];
        }

        clusterNr = selectedPortal.cluster;
        portals = filter(this.props.portals, { 'cluster': clusterNr});
        return portals;
    }
});

