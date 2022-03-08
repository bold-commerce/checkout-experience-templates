import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import React from 'react';
import * as Store from '../../store';
import Theme from './theme';


const store = Store.initializeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

ReactDOM.render(
    <Provider store={store}>
        <Theme />
    </Provider>
    , document.getElementById('main'));

