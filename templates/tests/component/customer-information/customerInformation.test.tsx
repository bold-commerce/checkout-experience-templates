import {mocked} from 'ts-jest/utils';
import {useIsUserAuthenticated} from 'src/hooks';
import {render} from '@testing-library/react';
import {CustomerInformation} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';


jest.mock('src/hooks/useIsUserAuthenticated');
const useIsUserAuthenticatedMock = mocked(useIsUserAuthenticated, true);
const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <CustomerInformation/>
    </Provider>;

describe('Testing CustomerInformation component', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('customer information component - authenticated user', () => {
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);

        const {container} = render(component);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);

    });

    test('customer information component - guest user', () => {
        useIsUserAuthenticatedMock.mockReturnValueOnce(false);

        const {container} = render(component);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(0);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
    });

});
