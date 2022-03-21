import {fireEvent, render, screen} from '@testing-library/react';
import {FieldCheckbox} from 'src/components';
import React from 'react';
import {IFieldCheckboxProps} from 'src/types';

describe('Testing FieldCheckbox component', () => {
    const props: IFieldCheckboxProps = {
        className: 'field-test',
        value: '0',
        checked: false,
        name: 'test-name',
        handleChange: jest.fn()
    };

    test('Render the FieldCheckbox with proper data', () => {
        render(<FieldCheckbox {...props}/>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-checkbox');
        expect(element).toBeTruthy();
        expect(element.value).toBe(props.value);
        expect(element.checked).toBe(props.checked);
        expect(element.name).toBe(props.name);
    });

    test('Check change handler event called', () => {
        render(<FieldCheckbox {...props}/>);
        const element = screen.getByTestId('field-checkbox');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });


});
