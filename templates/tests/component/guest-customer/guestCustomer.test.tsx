import {IUseGuestCustomer} from 'src/types';
import {mocked} from 'ts-jest/utils';
import {useGuestCustomer} from 'src/hooks';
import {render} from '@testing-library/react';
import {GuestCustomer} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';

jest.mock('src/hooks/useGuestCustomer');
const useGuestCustomerMock = mocked(useGuestCustomer, true);
const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <GuestCustomer/>
    </Provider>;

describe('Testing GuestCustomer component', () => {

    const hooksReturn: IUseGuestCustomer = {
        email: 'test-email',
        getTerm: jest.fn(),
        emailError: '',
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: false,
        acceptMarketingHidden: false
    };

    beforeEach(() => {
        jest.resetAllMocks();

    });

    test('Rendering the component correctly', () => {
        useGuestCustomerMock.mockReturnValueOnce(hooksReturn);
        const {container} = render(component);
        expect(container.getElementsByClassName('customer-information').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__email').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

    test('Rendering the component with hidden field', () => {
        const tempHooksReturn = {...hooksReturn, acceptMarketingHidden: true};
        useGuestCustomerMock.mockReturnValueOnce(tempHooksReturn);
        const {container} = render(component);
        expect(container.getElementsByClassName('hidden').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

});
