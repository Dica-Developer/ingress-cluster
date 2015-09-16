import React from 'react';
import {times} from 'lodash';
import template from './cluster-options.rt';
import store from '../../stores/map-store';
import dispatcher from '../../dispatcher/app-dispatcher.js';


function getState() {
    return store.getState();
}

export default React.createClass({
    getInitialState(){
        return getState();
    },

    componentWillMount(){
        store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        store.removeChangeListener(this._onChange);
    },

    render: template,

    _getClusterOptions(){
        return [
            {
                'nr': 'all',
                'label': 'All'
            }
        ].concat(times(this.state.nrOfCluster, (index) => {
                return {
                    'nr': index,
                    'label': 'Cluster ' + index
                };
            }));
    },

    _onChange(){
        this.setState(getState());
    },

    _handleNumberOfClusterChanged(){
        let value = this.refs['cluster-input'].getValue();
        dispatcher.handleViewAction({
            type: 'PERCENT_CHANGED',
            value: value
        });
    },

    _handleDisplayClusterChanged(event){
        dispatcher.handleViewAction({
            type: 'DISPLAY_CLUSTER_CHANGED',
            value: event.target.value
        });
    }

});
