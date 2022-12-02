import {render, screen} from '@testing-library/react';
import {DisplayPaymentMethod} from 'src/components';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@bold-commerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {getTerm} from 'src/utils';

jest.mock('src/hooks/useGetPaymentType');
jest.mock('src/utils/getTerm');
const getTermMock = mocked(getTerm, true);
const getPaymentTypeMock = mocked(useGetPaymentType, true);


describe('Testing DisplayPaymentMethod component', () => {
    let props: IPayment = stateMock.data.application_state.payments[0];
    const hookReturnMock = 'Visa: •••• •••• •••• 1111';

    beforeEach(() => {
        jest.resetAllMocks();
        props = {...stateMock.data.application_state.payments[0]} as IPayment;
        getPaymentTypeMock.mockReturnValue(hookReturnMock);
        getTermMock.mockReturnValue('some_text');
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

    test('rendering the component successfully with no Brand', () => {
        const textContent = Constants.OTHER_PAYMENT_TYPE;
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        delete props['brand'];
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(0);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(1);
    });

    test('rendering the component successfully with no lineText and empty display_string', () => {
        const textContent = Constants.OTHER_PAYMENT_TYPE;
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        delete props['lineText'];
        props['display_string'] = '';
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(1);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(0);
    });

    test('rendering the component successfully with empty lineText and empty display_string', () => {
        const textContent = Constants.OTHER_PAYMENT_TYPE;
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        props['lineText'] = '';
        props['display_string'] = '';
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(1);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(0);
    });

    test('rendering the component successfully with empty display_string', () => {
        const textContent = Constants.OTHER_PAYMENT_TYPE;
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        props['display_string'] = '';
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(1);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(0);
    });

    test('rendering the component successfully with empty brand', () => {
        const textContent = Constants.OTHER_PAYMENT_TYPE;
        getPaymentTypeMock.mockReturnValueOnce(textContent);
        props.brand = '';
        props.display_string = '1111';
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(container.getElementsByClassName('card-type__brand-name').length).toBe(0);
        expect(container.getElementsByClassName('card-type__last-four-digits').length).toBe(1);
    });
});
