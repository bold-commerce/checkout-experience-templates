import {render} from '@testing-library/react';
import {DisplayPaymentMethods} from 'src/components';
import {useGetDisplayPaymentMethods} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/hooks/useGetDisplayPaymentMethods');
const useGetDisplayPaymentMethodsMock = mocked(useGetDisplayPaymentMethods, true);

describe('testing Display Payment Methods component', () => {
    const hookReturnMock = {
        paymentsMethod: initialDataMock.application_state.payments,
        terms: {noPaymentMethod: 'No payment method'}
    };

    beforeEach(() => {
        useGetDisplayPaymentMethodsMock.mockReturnValue(hookReturnMock);
    });

    test('Rendering component - no payment methods', () => {
        useGetDisplayPaymentMethodsMock.mockReturnValueOnce({...hookReturnMock, paymentsMethod: [] as Array<IPayment>});
        const {container} = render(<DisplayPaymentMethods/>);

        expect(container.getElementsByClassName('display-payment-methods-container').length).toBe(1);
        expect(container.getElementsByClassName('display-payment-methods-empty-content').length).toBe(1);
        expect(container.getElementsByClassName('display-payment-methods-empty-content')[0].textContent).toBe(hookReturnMock.terms.noPaymentMethod);
    });

    test('Rendering component - payment methods', () => {
        const {container} = render(<DisplayPaymentMethods/>);

        expect(container.getElementsByClassName('display-payment-methods-container').length).toBe(1);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('display-payment-methods-empty-content').length).toBe(0);
    });

});
