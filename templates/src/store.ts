import {applyMiddleware, createStore, Store, Middleware} from 'redux';
import RootReducer from './reducer/rootReducer';
import thunkMiddleware from 'redux-thunk';
import {actionGetInitialData} from './action';
import {composeWithDevTools} from '@redux-devtools/extension';
import {initializeSession} from 'src/library';
import {getOrderInitialization} from 'src/utils';
import {defaultOrderInitialization} from './constants/orderInitialization';
import {IInitializeOrderResponse} from '@boldcommerce/checkout-frontend-library';

export function initializeStore(orderData?: IInitializeOrderResponse): Store {

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
