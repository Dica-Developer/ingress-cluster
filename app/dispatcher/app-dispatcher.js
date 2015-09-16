'use strict';

import {Dispatcher} from 'flux';
import assign from 'object-assign';
import {PAYLOADS} from '../constants';
import debug from '../utils/debug';

var dd = debug('app-dispatcher');

export default assign(new Dispatcher(), {

    handleBackendAction(action) {
        dd('view action', action);

        if (!action.type) {
            throw new Error('Empty action.type: you likely mistyped the action.')
        }

        var payload = {
            source: PAYLOADS.BACKEND_ACTION,
            action: action
        };

        this.dispatch(payload)
    },

    handleViewAction(action) {
        dd('view action', action);

        if (!action.type) {
            throw new Error('Empty action.type: you likely mistyped the action.')
        }

        var payload = {
            source: PAYLOADS.VIEW_ACTION,
            action: action
        };

        this.dispatch(payload)
    }
})
