import {render, screen} from '@testing-library/react';
import {DisplayPaymentMethod} from 'src/components';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/hooks/useGetPaymentType');
const getPaymentTypeMock = mocked(useGetPaymentType, true);


describe('Testing DisplayPaymentMethod component', () => {
    const props: IPayment = stateMock.data.application_state.payments[0];
    const hookReturnMock = {
        paymentMethodName: 'Visa',
        paymentMethodValue: '•••• •••• •••• 1111',
    };
    const textContent = `${hookReturnMock.paymentMethodName}: ${hookReturnMock.paymentMethodValue}`;

    beforeEach(() => {
        getPaymentTypeMock.mockReturnValue(hookReturnMock);
    });


    test('rendering the component successfully', () => {
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(screen.getAllByText(textContent).length).toBe(1);
    });

});
