import {applyMiddleware, createStore, Store, Middleware} from 'redux';
import RootReducer from './reducer/rootReducer';
import thunkMiddleware from 'redux-thunk';
import {actionGetInitialData} from './action';
import {composeWithDevTools} from 'redux-devtools-extension';
import {initializeSession} from 'src/library';
import {getOrderInitialization} from './utils/getOrderInitialization';
import { IInitializeEndpointData } from './types';
import { defaultOrderInitialization } from './constants/orderInitialization';

export function initializeStore(orderData?:  IInitializeEndpointData): Store {

    const compose = composeWithDevTools({});
    const middleware: Middleware[] = [thunkMiddleware];
    const orderInitialization = orderData ? getOrderInitialization(orderData) : defaultOrderInitialization;

    const store = createStore(RootReducer, orderInitialization, compose(
        applyMiddleware(...middleware)
    ));

    if (orderData) {
        store.dispatch(initializeSession);
        store.dispatch(actionGetInitialData(window.location.hostname));
    }

    return store;
}
