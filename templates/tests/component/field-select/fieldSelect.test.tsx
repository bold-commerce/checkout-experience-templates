import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {FieldSelect} from 'src/components';
import {IFieldSelectProps, ISelectList} from 'src/types';
import {mocked} from 'jest-mock';
import {useGetIsLoadingExceptSections} from 'src/hooks';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

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

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the FieldInput properly with correct data', () => {
        const {container} = render(<FieldSelect {...props}/>);
        expect(container.getElementsByClassName('select-field__container').length).toBe(1);
        expect(container.getElementsByClassName('select-field').length).toBe(1);
        expect(container.getElementsByClassName('select-field__label').length).toBe(1);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
    });

    test('Test field with value not empty', () => {
        const {container} = render(<FieldSelect {...props}/>);
        expect(container.getElementsByClassName('select-field--has-value').length).toBe(1);
    });

    test('Test field with value empty', () => {
        const localProps = {...props};
        localProps.value = '';
        const {container} = render(<FieldSelect {...localProps}/>);
        expect(container.getElementsByClassName('select-field--has-value').length).toBe(0);
    });

    test('Test with error message', () => {
        const localProps = {...props};
        localProps.errorMessage = 'test-message';
        const {container} = render(<FieldSelect {...localProps}/>);
        expect(container.getElementsByClassName('field--alert').length).toBe(1);
    });

    test('Check change handler event called', () => {
        render(<FieldSelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'two'}});
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });

    test('Check focus handler event', () => {
        const localProps = {...props};
        localProps.handleFocus = jest.fn();
        const {container} = render(<FieldSelect {...localProps}/>);
        const element = screen.getByTestId('input-select');
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(0);
        fireEvent.focus(element, {target: {value: 'two'}});
        expect(localProps.handleFocus).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(1);
    });

    test('Check blur handler event', () => {
        const localProps = {...props};
        localProps.handleBlur = jest.fn();
        const {container} = render(<FieldSelect {...localProps}/>);
        const element = screen.getByTestId('input-select');
        fireEvent.focus(element);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(1);
        fireEvent.blur(element);
        expect(localProps.handleBlur).toHaveBeenCalledTimes(1);
        expect(container.getElementsByClassName('select-field--has-focus').length).toBe(0);
    });


    test('Test blur with handleBlur being undefined in props', () => {
        const localProps = {...props, handleBlur: undefined};

        const { getByTestId } = render(<FieldSelect {...localProps}/>);

        const element = getByTestId('input-select');
        fireEvent.blur(element);

        // No expecting needed. If component throws an error test will fail which is good.
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
