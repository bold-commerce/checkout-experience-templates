import {fireEvent, render, screen} from '@testing-library/react';

import {Textarea} from 'src/components';
import {ITextareaProps} from 'src/types';
import React from 'react';

describe('testing textarea component', () => {
    const props: ITextareaProps = {
        id: '1',
        className: 'textarea_class_name',
        name: 'test',
        value: 'test',
        placeholder: 'test',
        testId: 'test_id',
        messageType: 'success',
        maxLength: 1000,
        minLength: 10,
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onChange: jest.fn(),
        onKeyUp: jest.fn(),
        onKeyDown: jest.fn(),

    };

    test('Rendering textarea component', () => {
        const {container} = render(<Textarea {...props}/>);

        expect(container.getElementsByClassName('textarea_class_name').length).toBe(1);
        expect(container.getElementsByClassName('textarea__textarea-element').length).toBe(1);
        expect(container.getElementsByClassName('textarea--success').length).toBe(1);
    });

    test('test onChange handler', () => {
        render(<Textarea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.change(textarea, {target: {value: 'a'}});
        expect(props.onChange).toHaveBeenCalledTimes(1);
    });

    test('test onFocus handler', () => {
        render(<Textarea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.focus(textarea, {target: {value: 'a'}});
        expect(props.onFocus).toHaveBeenCalledTimes(1);
    });

    test('test onBlur handler', () => {
        render(<Textarea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.blur(textarea, {target: {value: 'a'}});
        expect(props.onBlur).toHaveBeenCalledTimes(1);
    });
});
