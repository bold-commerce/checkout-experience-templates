import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {useLogin} from 'src/hooks';
import {LoggedInCustomer} from 'src/components';
import {getTerm} from 'src/utils';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';

jest.mock('src/hooks/useLogin');
jest.mock('src/utils/getTerm');
const useLoginMock = mocked(useLogin, true);
const getTermMock = mocked(getTerm, true);

const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <LoggedInCustomer/>
    </Provider>;

describe('Testing LoggedInCustomer component', () => {
    const hooksReturn = {
        loginUrl: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: true,
        email: 'test',
        acceptMarketingHidden: false
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock
            .mockReturnValueOnce('customer-info-test')
            .mockReturnValueOnce('not-you-test')
            .mockReturnValueOnce('accepts-marketing-test');
    });

    test('Rendering the component correctly', () => {
        useLoginMock.mockReturnValueOnce(hooksReturn);
        const {container} = render(component);
        expect(container.getElementsByClassName('customer-information').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated-email').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
        expect(container.getElementsByClassName('address__saved').length).toBe(1);
        expect(container.getElementsByTagName('a').length).toBe(1);
    });

    test('Rendering the component with hidden field', () => {
        const tempHooksReturn = {...hooksReturn, acceptMarketingHidden: true};
        useLoginMock.mockReturnValueOnce(tempHooksReturn);
        const {container} = render(component);
        expect(container.getElementsByClassName('hidden').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

});
