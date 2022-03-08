import {IAddressFieldSelectProps, ISavedAddressHookProps, ISelectList} from 'src/types';
import {Constants} from 'src/constants';
import * as useGetSavedAddressData from 'src/hooks/useGetSavedAddressData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AddressSavedSelect} from 'src/components';


describe('Testing AddressSavedSelect component', () => {
    let addressHook: jest.SpyInstance;
    const one = 1;

    const props:IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };

    const options: Array<ISelectList>= [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];

    const hookResult: ISavedAddressHookProps= {
        placeholder: 'test',
        label: 'test-label',
        id: 'test-id',
        options: options,
        handleChange: jest.fn()
    };

    test('Render the AddressSavedSelect properly', () => {
        addressHook = jest.spyOn(useGetSavedAddressData, 'useGetSavedAddressData').mockReturnValue(hookResult);
        const {container} = render(<AddressSavedSelect {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(one);
    });

    test('test the change event', () => {
        addressHook = jest.spyOn(useGetSavedAddressData, 'useGetSavedAddressData').mockReturnValue(hookResult);
        render(<AddressSavedSelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(one);
    });

});
