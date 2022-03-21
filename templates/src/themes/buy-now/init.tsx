import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import React from 'react';
import * as Store from 'src/store';
import Theme from 'src/themes/buy-now/theme';
import { Modal } from 'src/themes/buy-now/components/Modal';


const store = Store.initializeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const div = document.createElement('div');
div.setAttribute('id', 'bold-buyNow-experience');
document.body.appendChild(div);

ReactDOM.render(
    <Provider store={store}>
        <Modal>
            <Theme />
        </Modal>
    </Provider>
    , document.getElementById('bold-buyNow-experience')
);
