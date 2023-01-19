import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {AddressFieldInput} from 'src/components';
import {Constants} from 'src/constants';
import {useGetAddressFieldInputData, useGetIsLoadingExceptSections} from 'src/hooks';
import {IAddressHookProps, IAddressFieldInputProps} from 'src/types';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetAddressFieldInputData');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetAddressFieldInputDataMock = mocked(useGetAddressFieldInputData, true);

describe('Testing addressFieldInput component', () => {

    const props:IAddressFieldInputProps = {
        type: Constants.SHIPPING,
        fieldId: 'test-field',
        className: 'test-class',
        placeholder: 'test-placeholder',
        debounceApiCall: () => jest.fn()
    };

    const hookResult: IAddressHookProps= {
        placeholder: 'test',
        id: 'test-id',
        name: 'test-name',
        value: '1',
        handleChange: jest.fn()
    };

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the AddressFieldInput properly', () => {
        useGetAddressFieldInputDataMock.mockReturnValueOnce(hookResult);
        const {container} = render(<AddressFieldInput {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(container.getElementsByClassName('address__hidden').length).toBe(0);
        const element: Partial<HTMLInputElement> = container.getElementsByTagName('input')[0];
        expect(element.id).toBe(hookResult.id);
        expect(element.value).toBe(hookResult.value);
        expect(element.name).toBe(hookResult.name);
        expect(element.placeholder).toBe(hookResult.placeholder);
    });

    test('test the change event', () => {
        useGetAddressFieldInputDataMock.mockReturnValueOnce(hookResult);
        render(<AddressFieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

});
