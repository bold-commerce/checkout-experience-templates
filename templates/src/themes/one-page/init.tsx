import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import React from 'react';
import * as Store from '../../store';
import Theme from './theme';
import * as BugReporter from 'src/utils/bugReporter';
import {ErrorBoundary, ErrorFallback} from 'src/components';

BugReporter.init('one-page');
const store = Store.initializeStore(window.initializedOrder.data);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary fallbackComponent={ErrorFallback}>
            <Theme />
        </ErrorBoundary>
    </Provider>
    , document.getElementById('main'));

