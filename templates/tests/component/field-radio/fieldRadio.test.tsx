import {fireEvent, render, screen} from '@testing-library/react';
import {FieldRadio} from 'src/components';
import React from 'react';
import {IFieldRadioProps} from 'src/types';
import {mocked} from 'jest-mock';
import {useGetIsLoadingExceptSections} from 'src/hooks';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('Testing FieldRadio component', () => {
    const props: IFieldRadioProps = {
        className: 'field-test',
        value: '0',
        checked: false,
        name: 'test-name',
        handleChange: jest.fn()
    };

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the FieldRadio with proper data', () => {
        render(<FieldRadio {...props}/>);
        const element: Partial<HTMLInputElement> = screen.getByTestId('field-radio');
        expect(element).toBeTruthy();
        expect(element.value).toBe(props.value);
        expect(element.checked).toBe(props.checked);
        expect(element.name).toBe(props.name);
    });

    test('Check change handler event called', () => {
        render(<FieldRadio {...props}/>);
        const element = screen.getByTestId('field-radio');
        fireEvent.click(element);
        expect(props.handleChange).toHaveBeenCalledTimes(1);
    });


});
