import React from 'react';
import {render, screen} from '@testing-library/react';
import {FieldDatePicker} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetAppSettingData, useGetDatePickerLanguage, useGetIsLoadingExceptSections} from 'src/hooks';

jest.mock('src/hooks/useGetDatePickerLanguage');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetDatePickerLanguageMock = mocked(useGetDatePickerLanguage, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing FieldDatePicker component', () => {
    let props;

    beforeEach(() => {
        props = {
            placeholder: 'placeholder',
            className: 'test',
            date: '2010/01/01',
            value: 'value',
            id: 'id',
            handleChange: jest.fn(),
        };
        useGetDatePickerLanguageMock.mockReturnValue({});
        useGetAppSettingDataMock.mockReturnValue('en');
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the FieldDatePicker properly with correct data', () => {
        const {container} = render(<FieldDatePicker {...props}/>);
        const input: Partial<HTMLInputElement> = screen.getByTestId('input-field');
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(input.id).toBe(props.id);
        expect(input.value).toBe('January 1, 2010');
        expect(input.name).toBe(props.id);
        expect(input.placeholder).toBe(props.placeholder);
    });
});
