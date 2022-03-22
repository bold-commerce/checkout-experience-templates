import  * as getTerm from 'src/utils/getTerm';
import {render} from '@testing-library/react';
import {LoginPrompt} from 'src/components';
import React from 'react';
import {Provider} from 'react-redux';
import * as Store from 'src/store';

const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <LoginPrompt/>
    </Provider>;

describe('Testing LoginPrompt component', () => {
    let getTermSpy: jest.SpyInstance;
    beforeEach(() => {
        getTermSpy = jest.spyOn(getTerm, 'getTerm');
    });

    test('Render the FieldSection properly', () => {
        const {container} = render(component);
        expect(container.getElementsByClassName('LoginPrompt').length).toBe(1);
        expect(getTermSpy).toHaveBeenCalledTimes(2);
        expect(container.getElementsByTagName('a').length).toBe(1);
    });
});
