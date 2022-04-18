import {IAddressCountryHookProps, IAddressFieldSelectProps, ISelectList} from 'src/types';
import {Constants} from 'src/constants';
import * as useGetAddressCountryInputData from 'src/hooks/useGetAddressCountrySelectData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AddressCountrySelect} from 'src/components';


describe('Testing AddressCountrySelect component', () => {
    let addressHook: jest.SpyInstance;

    const props:IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };

    const options: Array<ISelectList>= [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];

    const hookResult: IAddressCountryHookProps= {
        placeholder: 'test',
        label: 'test-label',
        id: 'test-id',
        name: 'test-name',
        value: 'option1',
        countryOptions: options,
        handleChange: jest.fn()
    };

    test('Render the AddressCountrySelect properly', () => {
        addressHook = jest.spyOn(useGetAddressCountryInputData, 'useGetAddressCountryInputData').mockReturnValue(hookResult);
        const {container} = render(<AddressCountrySelect {...props}/>);
        expect(container.getElementsByClassName('address__country').length).toBe(1);
        const element: Partial<HTMLSelectElement> = container.getElementsByTagName('select')[0];
        expect(element.id).toBe(hookResult.id);
        expect(element.value).toBe(hookResult.value);
        expect(element.name).toBe(hookResult.name);
        expect((screen.getByText(hookResult.value) as HTMLOptionElement).selected).toBeTruthy();
    });

    test('test the change event', () => {
        addressHook = jest.spyOn(useGetAddressCountryInputData, 'useGetAddressCountryInputData').mockReturnValue(hookResult);
        render(<AddressCountrySelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

});
