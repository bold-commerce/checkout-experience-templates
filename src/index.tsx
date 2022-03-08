import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as Store from './store';

const store = Store.initializeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

ReactDOM.render(
    <Provider store={store}>
    </Provider>
    , document.getElementById('main'));
