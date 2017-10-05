import { Map, OrderedMap } from 'immutable';
import { combineReducers } from 'redux';

/**
 * Normalizes API payload.
 *
 * @param {Array} payload each value must have property `id`
 *
 * @return {Map}
 */
function apiToMap(payload) {
    return Map(Object.assign(...payload.map(d => ({ [d.id]: d }))));
}

/**
 * Provides a key-value store of all relevant notifications.
 *
 * @param {Map} state
 * @param {Object} action
 */
export const byId = (state = Map(), action = { type: null }) => {
    switch (action.type) {
        case 'notification/RECEIVE_ALL':
            return apiToMap(action.payload);
        case 'notification/APPEND_SOME':
            return state.merge(apiToMap(action.payload));
        case 'notification/MARK_ALL_READ':
            return state.map(n => {
                return {
                    ...n,
                    read: true,
                };
            });
        case 'notification/MARK_ONE_READ':
            return state.set(action.id, {
                ...state.get(action.id),
                read: true,
            });
        case 'notification/MARK_ONE_SHOWN':
            return state.set(action.id, {
                ...state.get(action.id),
                shown: true,
            });
        default:
            return state;
    }
};

/**
 * Provides a key-value store of all unread notifications.
 *
 * @param {Map} state
 * @param {Object} action
 */
export const unread = (state = OrderedMap(), action = { type: null }) => {
    switch (action.type) {
        case 'notification/RECEIVE_ALL':
            return apiToMap(action.payload)
                .filter(n => !n.read)
                .sortBy(n => n.created).reverse();
        case 'notification/APPEND_SOME':
            return state
                .merge(apiToMap(action.payload).filter(n => !n.read))
                .sortBy(n => n.created).reverse();
        case 'notification/MARK_ALL_READ':
            return OrderedMap();
        case 'notification/MARK_ONE_READ':
            return state.delete(action.id);
        default:
            return state;
    }
};

/**
 * Provides a key-value store of all unshown notifications.
 *
 * @param {Map} state
 * @param {Object} action
 */
export const unshown = (state = OrderedMap(), action = { type: null }) => {
    switch (action.type) {
        case 'notification/RECEIVE_ALL':
            return apiToMap(action.payload)
                .filter(n => !n.shown)
                .sortBy(n => n.created).reverse();
        case 'notification/APPEND_SOME':
            return state
                .merge(apiToMap(action.payload).filter(n => !n.shown))
                .sortBy(n => n.created).reverse();
        case 'notification/MARK_ONE_SHOWN':
            return state.delete(action.id);
        default:
            return state;
    }
};

const notificationReducer = combineReducers({
    byId,
    unread,
    unshown,
});

export default notificationReducer;