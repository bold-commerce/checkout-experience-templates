import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {FieldInput} from 'src/components';
import {IFieldInputProps} from 'src/types';

describe('Testing FieldInput component', () => {
    let props;
    const one = 1;
    const zero = 0;

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
    });

    test('Render the FieldInput properly with correct data', () => {
        const {container} = render(<FieldInput {...props}/>);
        const input: Partial<HTMLInputElement> = screen.getByTestId('input-field');
        expect(container.getElementsByClassName('input-field__container').length).toBe(one);
        expect(container.getElementsByClassName('input-field').length).toBe(one);
        expect(container.getElementsByClassName('input-field__label').length).toBe(one);
        expect(container.getElementsByClassName(props.className).length).toBe(one);
        expect(input.id).toBe(props.id);
        expect(input.value).toBe(props.value);
        expect(input.name).toBe(props.name);
        expect(input.type).toBe(props.type);
        expect(input.placeholder).toBe(props.placeholder);

    });

    test('Test field with value not empty', () => {
        const {container} = render(<FieldInput {...props}/>);
        expect(container.getElementsByClassName('input-field--has-value').length).toBe(one);
    });

    test('Test field with value empty', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.value = '';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('input-field--has-value').length).toBe(zero);
    });

    test('Check change handler event called', () => {
        render(<FieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(props.handleChange).toHaveBeenCalledTimes(one);
    });

    test('Check blur handler event called', () => {
        render(<FieldInput {...props}/>);
        const input = screen.getByTestId('input-field');
        fireEvent.blur(input, {target: {value: 'a'}});
        expect(props.handleBlur).toHaveBeenCalledTimes(one);
        expect(props.handleChange).toHaveBeenCalledTimes(zero);
    });

    test('Test with error message', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.errorMessage = 'test-message';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(one);
    });

    test('Test without error message', () => {
        const localProps: IFieldInputProps = {...props};
        localProps.errorMessage = '';
        const {container} = render(<FieldInput {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(zero);
    });

});
