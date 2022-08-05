import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import React from 'react';
import {Provider} from 'react-redux';
import {LoginPrompt} from 'src/components';
import * as Store from 'src/store';
import {getTerm} from 'src/utils';

const store = Store.initializeStore();
jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

const component =
    <Provider store={store}>
        <LoginPrompt/>
    </Provider>;

describe('Testing LoginPrompt component', () => {

    test('Render the FieldSection properly', () => {
        const {container} = render(component);
        expect(container.getElementsByClassName('LoginPrompt').length).toBe(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(container.getElementsByTagName('a').length).toBe(1);
    });
});
