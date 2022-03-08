import {IApplicationStatePayment} from 'src/types';
import {render, screen} from '@testing-library/react';
import {DisplayPaymentMethod} from 'src/components';
import {stateMock} from 'src/mocks';


describe('Testing DisplayPaymentMethod component', () => {
    const props: IApplicationStatePayment = stateMock.data.application_state.payments[0];

    test('rendering the component successfully', () => {
        const {container} = render(<DisplayPaymentMethod {...props}/>);
        expect(container.getElementsByClassName('display-payment-methods-content').length).toBe(1);
        expect(screen.getAllByText(props.brand).length).toBe(1);
    });

});
