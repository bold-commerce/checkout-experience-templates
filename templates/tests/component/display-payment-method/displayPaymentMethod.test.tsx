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
    const hookReturnMock = 'Visa: •••• •••• •••• 1111';

    beforeEach(() => {
        getPaymentTypeMock.mockReturnValue(hookReturnMock);
    });

    test('rendering the component successfully', () => {
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(screen.getAllByText(hookReturnMock).length).toBe(1);
    });

    test('rendering the component successfully with no Payment Method Name', () => {
        const textContent = '1111';
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(screen.getAllByText(textContent).length).toBe(1);
    });
});
