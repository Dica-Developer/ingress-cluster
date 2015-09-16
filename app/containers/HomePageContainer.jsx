import React from 'react'
import template from './HomePage.rt';
import store from '../stores/map-store';

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

    _onChange(){
        this.setState(getState());
    }

});
