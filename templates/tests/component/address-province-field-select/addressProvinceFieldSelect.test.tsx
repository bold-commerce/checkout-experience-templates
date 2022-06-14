import {
    IAddressFieldSelectProps,
    IAddressProvinceHookProps, ISelectList
} from 'src/types';
import {Constants} from 'src/constants';
import * as useGetAddressProvinceInputData from 'src/hooks/useGetAddressProvinceSelectData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AddressProvinceSelect} from 'src/components';


describe('Testing AddressProvinceSelect component', () => {
    const addressHook = jest.spyOn(useGetAddressProvinceInputData, 'useGetAddressProvinceInputData');

    const props:IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };

    const options: Array<ISelectList>= [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];

    const hookResult: IAddressProvinceHookProps= {
        placeholder: 'test',
        label: 'test-label',
        id: 'test-id',
        name: 'test-name',
        value: 'option1',
        provinceName: 'Option 1',
        showProvince: true,
        provinceOptions: options,
        handleChange: jest.fn()
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Render the AddressProvinceSelect properly', () => {
        addressHook.mockReturnValue(hookResult);
        const {container} = render(<AddressProvinceSelect {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(container.getElementsByClassName('address__hidden').length).toBe(0);
        const element: Partial<HTMLSelectElement> = container.getElementsByTagName('select')[0];
        expect(element.id).toBe(hookResult.id);
        expect(element.value).toBe(hookResult.value);
        expect(element.name).toBe(hookResult.name);
        expect((screen.getByText(hookResult.value) as HTMLOptionElement).selected).toBeTruthy();
    });

    test('Render the AddressFieldInput with show province as false', () => {
        const localHookResult = {...hookResult};
        localHookResult.showProvince = false;
        addressHook.mockReturnValue(localHookResult);

        const {container} = render(<AddressProvinceSelect {...props}/>);
        
        expect(container.getElementsByClassName('address__hidden').length).toBe(1);
    });

    test('test the change event', () => {
        addressHook.mockReturnValue(hookResult);

        render(<AddressProvinceSelect {...props}/>);

        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

    test('Unsupported province is rendered as an option until changed', () => {
        addressHook.mockReturnValue({
            ...hookResult,
            provinceName: 'Test Province',
            value: 'test-province',
            handleChange: jest.fn(),
        });

        const { container, rerender } = render(<AddressProvinceSelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(4);
        expect(container.querySelector('[value="test-province"]')).toBeTruthy();
        expect(container.querySelector('[value="test-province"]')?.textContent).toBe('Test Province');

        // Changing the country to a supported country
        addressHook.mockReturnValue({
            ...hookResult,
            provinceName: hookResult.provinceOptions[0].name,
            value: hookResult.provinceOptions[0].value,
        });
        rerender(<AddressProvinceSelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(3);
        expect(container.querySelector('[value="test-province"]')).toBeFalsy();
    });

    test('Unsupported province is rendered using province code instead of name', () => {
        addressHook.mockReturnValue({
            ...hookResult,
            provinceName: undefined,
            value: 'test-province',
            handleChange: jest.fn(),
        });

        const { container } = render(<AddressProvinceSelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(4);
        expect(container.querySelector('[value="test-province"]')).toBeTruthy();
        expect(container.querySelector('[value="test-province"]')?.textContent).toBe('test-province');
    });
});
