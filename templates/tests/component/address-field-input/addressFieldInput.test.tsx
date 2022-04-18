import * as useGetAddressFieldInputData from 'src/hooks/useGetAddressFieldInputData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AddressFieldInput} from 'src/components';
import {IAddressFieldHookProps, IAddressFieldInputProps} from 'src/types';
import {Constants} from 'src/constants';


describe('Testing addressFieldInput component', () => {
    let addressHook: jest.SpyInstance;

    const props:IAddressFieldInputProps = {
        type: Constants.SHIPPING,
        fieldId: 'test-field',
        className: 'test-class',
        placeholder: 'test-placeholder',
        debounceApiCall: () => jest.fn()
    };

    const hookResult: IAddressFieldHookProps= {
        placeholder: 'test',
        id: 'test-id',
        name: 'test-name',
        value: '1',
        showField: true,
        handleChange: jest.fn()
    };

    test('Render the AddressFieldInput properly', () => {
        addressHook = jest.spyOn(useGetAddressFieldInputData, 'useGetAddressFieldInputData').mockReturnValue(hookResult);
        const {container} = render(<AddressFieldInput {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(container.getElementsByClassName('address__hidden').length).toBe(0);
        const element: Partial<HTMLInputElement> = container.getElementsByTagName('input')[0];
        expect(element.id).toBe(hookResult.id);
        expect(element.value).toBe(hookResult.value);
        expect(element.name).toBe(hookResult.name);
        expect(element.placeholder).toBe(hookResult.placeholder);
    });

    test('Render the AddressFieldInput with showField as false', () => {
        const localHookResult = {...hookResult};
        localHookResult.showField = false;
        addressHook = jest.spyOn(useGetAddressFieldInputData, 'useGetAddressFieldInputData').mockReturnValue(localHookResult);
        const {container} = render(<AddressFieldInput {...props}/>);
        expect(container.getElementsByClassName('address__hidden').length).toBe(1);
    });

    test('test the change event', () => {
        addressHook = jest.spyOn(useGetAddressFieldInputData, 'useGetAddressFieldInputData').mockReturnValue(hookResult);
        render(<AddressFieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

});
