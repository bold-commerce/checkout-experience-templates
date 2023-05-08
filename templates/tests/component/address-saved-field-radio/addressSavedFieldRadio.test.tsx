import {fireEvent, render, screen} from '@testing-library/react';
import {AddressSavedFieldRadio} from 'src/components';
import React from 'react';
import {ISavedAddressFieldRadioProps} from 'src/types';
import { initialDataMock } from 'src/mocks';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

const mockDispatch = jest.fn();
const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    errors: [],
    isLoading: [],
    isValid: [{shippingAddress: false}]
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing AddressSavedFieldRadio component', () => {
    const address = initialDataMock.application_state.addresses.shipping as IAddress;
    const props: ISavedAddressFieldRadioProps = {
        address: address,
        checked: false,
        handleChange: jest.fn()
    };


    const testData = [
        { name: '', props: props, rows: 0},
        { name: ' including phone number', props: {...props, address: {...props.address, phone_number: '123-456-7890' }}, rows: 1}
    ]

    test.each(testData)(
        'Render the AddressSavedFieldRadio with proper data $name',
        ({props, rows}) => {
            const { container } =render(<AddressSavedFieldRadio {...props}/>);
            const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
            expect(element).toBeTruthy();
            expect(element.value).toBe(`${props.address.id}__${props.address.address_line_1}`);
            expect(element.checked).toBe(props.checked);
            expect(container.getElementsByClassName('saved-address-list-item').length).toBe(1);
            expect(container.getElementsByClassName('condensed-shipping').length).toBe(1);
            expect(container.getElementsByClassName('condensed-shipping__name').length).toBe(1);
            expect(container.getElementsByClassName('condensed-shipping__address').length).toBe(1);
            expect(container.getElementsByClassName('condensed-shipping__phone').length).toBe(rows);
            expect(container.getElementsByClassName('condensed-shipping__method').length).toBe(0);
        }
    );

    test('Check change handler event called', () => {
        render(<AddressSavedFieldRadio {...props}/>);
        const element = screen.getByTestId('field-radio');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });
});
