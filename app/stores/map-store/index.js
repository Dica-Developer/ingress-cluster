import AppDispatcher from '../../dispatcher/app-dispatcher.js';
import {EventEmitter} from 'events';
import assign from 'object-assign';
import {throttle} from 'lodash';

let CHANGE_EVENT = 'change';

let _mapState = {
    percent: 10,
    selectedCluster: 'all',
    nrOfCluster: 0
};

let MapStore = assign({}, EventEmitter.prototype, {

    getState: function () {
        return _mapState;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch (action.type) {

        case 'PERCENT_CHANGED':
            _mapState.percent = action.value;
            MapStore.emitChange();
            break;

        case 'DISPLAY_CLUSTER_CHANGED':
            _mapState.selectedCluster = action.value !== 'all' ? parseInt(action.value, 10) : action.value;
            MapStore.emitChange();
            break;

        case 'NR_OF_CLUSTERS_CHANGED':
            _mapState.nrOfCluster = action.value;
            MapStore.emitChange();
            break;

        }

        return true;
    })

});

module.exports = MapStore;
