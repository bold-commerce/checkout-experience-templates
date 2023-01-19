import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {FieldInput} from 'src/components';
import {IFieldInputProps} from 'src/types';
import {mocked} from 'jest-mock';
import {useGetIsLoadingExceptSections} from 'src/hooks';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('Testing FieldInput component', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'test-id',
            type: 'text',
            placeholder: 'test',
            className: 'field-test',
            value: 'value-test',
            name: 'test-name',
            handleChange: jest.fn(),
            handleBlur: jest.fn()
        };
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the FieldInput properly with correct data', () => {
        const {container} = render(<FieldInput {...props}/>);
        const input: Partial<HTMLInputElement> = screen.getByTestId('input-field');
        expect(container.getElementsByClassName('input-field__container').length).toBe(1);
        expect(container.getElementsByClassName('input-field').length).toBe(1);
        expect(container.getElementsByClassName('input-field__label').length).toBe(1);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(input.id).toBe(props.id);
        expect(input.value).toBe(props.value);
        expect(input.name).toBe(props.name);
        expect(input.type).toBe(props.type);
        expect(input.placeholder).toBe(props.placeholder);

    });

    test('Test field with value not empty', () => {
        const {container} = render(<FieldInput {...props}/>);
        expect(container.getElementsByClassName('input-field--has-value').length).toBe(1);
    });

    test('Test field with value empty', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.value = '';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('input-field--has-value').length).toBe(0);
    });

    test('Check change handler event called', () => {
        render(<FieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });

    test('Check blur handler event called', () => {
        render(<FieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.blur(input, {target: {value: 'a'}});
        expect(props.handleBlur).toHaveBeenCalledTimes(1);
        expect(props.handleChange).toHaveBeenCalledTimes(0);
    });

    test('Test with error message', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.errorMessage = 'test-message';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(1);
    });

    test('Test without error message', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.errorMessage = '';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(0);
    });

});
