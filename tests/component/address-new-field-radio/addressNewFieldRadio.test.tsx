import {fireEvent, render, screen} from '@testing-library/react';
import {AddressNewFieldRadio} from 'src/components';
import React from 'react';
import { INewAddressFieldRadioProps} from 'src/types';
import { Provider } from 'react-redux';
import * as Store from 'src/store';
import { Constants } from 'src/constants';

const store = Store.initializeStore();
describe('Testing AddressNewFieldRadio component', () => {
    const props: INewAddressFieldRadioProps = {
        type: Constants.SHIPPING,
        label: 'test',
        checked: false,
        handleChange: jest.fn()
    };

    const checkedProps: INewAddressFieldRadioProps = {
        type: Constants.SHIPPING,
        label: 'test',
        checked: true,
        handleChange: jest.fn()
    };

    test('Render the AddressNewFieldRadio unchecked with hidden Address form', () => {
        const { container } =render(<Provider store={store}><AddressNewFieldRadio {...props}/></Provider>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
        expect(element).toBeTruthy();
        expect(element.checked).toBe(props.checked);
        expect(container.getElementsByClassName('stx-radio-field__label')[0].innerHTML).toBe(props.label); 
    });

    test('Render the AddressNewFieldRadio checked with Address form', () => {
        const { container } =render(<Provider store={store}><AddressNewFieldRadio {...checkedProps}/></Provider>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
        expect(element).toBeTruthy();
        expect(element.checked).toBe(checkedProps.checked);
        expect(container.getElementsByClassName('stx-radio-field__label')[0].innerHTML).toBe(checkedProps.label);

        expect(container.getElementsByClassName('address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('address__first').length).toBe(1);
        expect(container.getElementsByClassName('address__last').length).toBe(1);
        expect(container.getElementsByClassName('address__company').length).toBe(1);
        expect(container.getElementsByClassName('address__address').length).toBe(1);
        expect(container.getElementsByClassName('address__address2').length).toBe(1);
        expect(container.getElementsByClassName('address__city').length).toBe(1);
        expect(container.getElementsByClassName('address__country').length).toBe(1);
        expect(container.getElementsByClassName('address__province').length).toBe(1);
        expect(container.getElementsByClassName('address__postal_code').length).toBe(1);
        expect(container.getElementsByClassName('address__phone').length).toBe(1);
    });
    
    test('Check change handler event called', () => {
        render(<Provider store={store}><AddressNewFieldRadio {...props}/></Provider>);
        const element = screen.getByTestId('field-radio');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalled();
    });
});
