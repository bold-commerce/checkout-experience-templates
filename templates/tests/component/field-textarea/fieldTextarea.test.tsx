import {fireEvent, render, screen} from '@testing-library/react';

import {FieldTextArea} from 'src/components';
import {IFieldTextareaProps} from 'src/types';
import React from 'react';
import {useGetIsLoadingExceptSections} from 'src/hooks';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('testing field textarea component', () => {
    const props: IFieldTextareaProps = {
        id: '1',
        className: 'textarea_class_name',
        name: 'test',
        value: 'test',
        placeholder: 'test',
        testId: 'test_id',
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onChange: jest.fn(),
        onKeyUp: jest.fn(),
        onKeyDown: jest.fn(),

    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('rendering field textarea component', () => {
        const {container} = render(<FieldTextArea {...props}/>);

        expect(container.getElementsByClassName('textarea-field__container').length).toBe(1);
        expect(container.getElementsByClassName('textarea-field__label').length).toBe(1);
    });

    test('test field textarea onChange handler', () => {
        render(<FieldTextArea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.change(textarea, {target: {value: 'a'}});
        expect(props.onChange).toHaveBeenCalledTimes(1);
    });

    test('test field textarea onFocus handler', () => {
        render(<FieldTextArea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.focus(textarea, {target: {value: 'a'}});
        expect(props.onFocus).toHaveBeenCalledTimes(1);
    });

    test('test field textarea onBlur handler', () => {
        render(<FieldTextArea {...props}/>);
        const textarea = screen.getByTestId('test_id');
        fireEvent.blur(textarea, {target: {value: 'a'}});
        expect(props.onBlur).toHaveBeenCalledTimes(1);
    });

    test('test error message', () => {
        const localProps: IFieldTextareaProps = {...props};
        localProps.messageType = 'alert';
        localProps.messageText = 'test-message';
        const {container} = render(<FieldTextArea {...localProps}/>);

        expect(container.getElementsByClassName('textarea-field__container').length).toBe(1);
        expect(container.getElementsByClassName('textarea-field__label').length).toBe(1);
        expect(container.getElementsByClassName('field--alert').length).toBe(1);
    });
});
