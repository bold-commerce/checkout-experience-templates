import {fireEvent, render, screen} from '@testing-library/react';
import {AddressSavedFieldRadio} from 'src/components';
import React from 'react';
import {IAddress, ISavedAddressFieldRadioProps} from 'src/types';
import { initialDataMock } from 'src/mocks';

describe('Testing AddressSavedFieldRadio component', () => {
    const address = initialDataMock.application_state.addresses.shipping as IAddress;
    const props: ISavedAddressFieldRadioProps = {
        address: address,
        checked: false,
        handleChange: jest.fn()
    };

    test('Render the AddressSavedFieldRadio with proper data', () => {
        const { container } =render(<AddressSavedFieldRadio {...props}/>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
        expect(element).toBeTruthy();
        expect(element.value).toBe(props.address.address_line_1);
        expect(element.checked).toBe(props.checked);
        expect(container.getElementsByClassName('display-address-container').length).toBe(1);
    });

    test('Check change handler event called', () => {
        render(<AddressSavedFieldRadio {...props}/>);
        const element = screen.getByTestId('field-radio');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });
});
