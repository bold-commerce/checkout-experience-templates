import {fireEvent, render, screen} from '@testing-library/react';
import {AddressNewFieldRadio} from 'src/components';
import React from 'react';
import { INewAddressFieldRadioProps} from 'src/types';
import { Constants } from 'src/constants';
import {storeMock} from 'src/mocks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

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
        const { container } =render(<AddressNewFieldRadio {...props}/>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
        expect(element).toBeTruthy();
        expect(element.checked).toBe(props.checked);
        expect(container.getElementsByClassName('stx-radio-field__label')[0].innerHTML).toBe(props.label);
    });

    test('Render the AddressNewFieldRadio checked with Address form', () => {
        const { container } =render(<AddressNewFieldRadio {...checkedProps}/>);
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
        render(<AddressNewFieldRadio {...props}/>);
        const element = screen.getByTestId('field-radio');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalled();
    });
});
