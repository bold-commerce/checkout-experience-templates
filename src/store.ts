import {applyMiddleware, createStore, Store, Middleware} from 'redux';
import RootReducer from './reducer/rootReducer';
import thunkMiddleware from 'redux-thunk';
import  {actionGetInitialData} from './action';
import {composeWithDevTools} from 'redux-devtools-extension';
import {orderInitialization} from 'src/constants/orderInitialization';
import {initializeSession} from 'src/library';

export function initializeStore(): Store {

    const compose = composeWithDevTools({});
    const middleware: Middleware[] = [thunkMiddleware];

    const store = createStore(RootReducer, orderInitialization , compose(
        applyMiddleware(...middleware)
    ));
    store.dispatch(initializeSession);
    store.dispatch(actionGetInitialData(window.location.hostname));

    return store;
}
