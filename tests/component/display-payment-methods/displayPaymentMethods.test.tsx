import {render} from '@testing-library/react';
import {DisplayPaymentMethods} from 'src/components';
import {counterNames} from 'src/constants';
import {useGetDisplayPaymentMethods} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {IApplicationStatePayment} from 'src/types';
import {mocked} from 'ts-jest/utils';

jest.mock('src/hooks/useGetDisplayPaymentMethods');
const useGetDisplayPaymentMethodsMock = mocked(useGetDisplayPaymentMethods, true);

describe('testing Display Payment Methods component', () => {
    const {zero, one} = counterNames;
    const hookReturnMock = {
        paymentsMethod: initialDataMock.application_state.payments,
        terms: {noPaymentMethod: 'No payment method'}
    };

    beforeEach(() => {
        useGetDisplayPaymentMethodsMock.mockReturnValue(hookReturnMock);
    });

    test('Rendering component - no payment methods', () => {
        useGetDisplayPaymentMethodsMock.mockReturnValueOnce({...hookReturnMock, paymentsMethod: [] as Array<IApplicationStatePayment>});
        const {container} = render(<DisplayPaymentMethods/>);

        expect(container.getElementsByClassName('display-payment-methods-container').length).toBe(one);
        expect(container.getElementsByClassName('display-payment-methods-empty-content').length).toBe(one);
        expect(container.getElementsByClassName('display-payment-methods-empty-content')[0].textContent).toBe(hookReturnMock.terms.noPaymentMethod);
    });

    test('Rendering component - payment methods', () => {
        const {container} = render(<DisplayPaymentMethods/>);

        expect(container.getElementsByClassName('display-payment-methods-container').length).toBe(one);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(one);
        expect(container.getElementsByClassName('display-payment-methods-empty-content').length).toBe(zero);
    });

});
