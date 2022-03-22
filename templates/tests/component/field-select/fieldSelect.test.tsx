import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {FieldSelect} from 'src/components';
import {IFieldSelectProps, ISelectList} from 'src/types';

describe('Testing FieldSelect component', () => {
    const options: Array<ISelectList>= [
        {name: 'one', value: 'one'},
        {name: 'two', value: 'two'}
    ];

    const props: IFieldSelectProps = {
        id: 'test-id',
        placeholder: 'test',
        className: 'field-test',
        value: 'one',
        name: 'test-name',
        options: options,
        isPlaceholderDisabled: true,
        handleChange: jest.fn(),
        handleBlur: jest.fn()
    };
    const one = 1;
    const zero = 0;

    test('Render the FieldInput properly with correct data', () => {
        const {container} = render(<FieldSelect {...props}/>);
        expect(container.getElementsByClassName('select-field__container').length).toBe(one);
        expect(container.getElementsByClassName('select-field').length).toBe(one);
        expect(container.getElementsByClassName('select-field__label').length).toBe(one);
        expect(container.getElementsByClassName(props.className).length).toBe(one);
    });

    test('Test field with value not empty', () => {
        const {container} = render(<FieldSelect {...props}/>);
        expect(container.getElementsByClassName('select-field--has-value').length).toBe(one);
    });

    test('Test field with value empty', () => {
        const localProps = {...props};
        localProps.value = '';
        const {container} = render(<FieldSelect {...localProps}/>);
        expect(container.getElementsByClassName('select-field--has-value').length).toBe(zero);
    });

    test('Test with error message', () => {
        const localProps = {...props};
        localProps.errorMessage = 'test-message';
        const {container} = render(<FieldSelect {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(one);
    });

    test('Check change handler event called', () => {
        render(<FieldSelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'two'}});
        expect(props.handleChange).toHaveBeenCalledTimes(one);
    });

    test('Check focus handler event', () => {
        const localProps = {...props};
        localProps.handleFocus = jest.fn();
        const {container} = render(<FieldSelect {...localProps}/>);
        const element = screen.getByTestId('input-select');
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(zero);
        fireEvent.focus(element, {target: {value: 'two'}});
        expect(localProps.handleFocus).toHaveBeenCalledTimes(one);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(one);
    });

    test('Check blur handler event', () => {
        const localProps = {...props};
        localProps.handleBlur = jest.fn();
        const {container} = render(<FieldSelect {...localProps}/>);
        const element = screen.getByTestId('input-select');
        fireEvent.focus(element);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(one);
        fireEvent.blur(element);
        expect(localProps.handleBlur).toHaveBeenCalledTimes(one);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(zero);
    });

    test('Check the placeholder without empty value', () => {
        render(<FieldSelect {...props}/>);
        const options= screen.getAllByTestId('input-select__options');
        const option: Partial<HTMLOptionElement> = options[0];
        expect(option.text).toBe(props.placeholder);
        expect(option.disabled).toBe(props.isPlaceholderDisabled);
    });

    test('Check the placeholder with empty value', () => {
        const localProps = {...props};
        localProps.placeholder = '';

        render(<FieldSelect {...localProps}/>);
        const options= screen.getAllByTestId('input-select__options');
        const option: Partial<HTMLOptionElement> = options[0];
        expect(option.text).not.toBe(localProps.placeholder);
    });

});
