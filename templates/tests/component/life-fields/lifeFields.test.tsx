import {render} from '@testing-library/react';

import {LifeFields} from 'src/components';
import {ILifeFieldCheckbox, ILifeFieldDatePicker, ILifeFieldInput, ILifeFieldSelect, ISelectList} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    useLifeFieldCheckbox,
    useGetIsLoadingExceptSections,
    useLifeFieldTextInput,
    useLifeFieldSelect,
    useLifeFieldDatePicker, useGetDatePickerLanguage, useGetAppSettingData
} from 'src/hooks';

jest.mock('src/hooks/useLifeFieldCheckbox');
jest.mock('src/hooks/useLifeFieldTextInput');
jest.mock('src/hooks/useLifeFieldSelect');
jest.mock('src/hooks/useLifeFieldDatePicker');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetDatePickerLanguage');
jest.mock('src/hooks/useGetAppSettingData');
const useLifeFieldCheckboxMock = mocked(useLifeFieldCheckbox, true);
const useLifeFieldTextInputMock = mocked(useLifeFieldTextInput, true);
const useLifeFieldSelectMock = mocked(useLifeFieldSelect, true);
const useLifeFieldDatePickerMock = mocked(useLifeFieldDatePicker, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetDatePickerLanguageMock = mocked(useGetDatePickerLanguage, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('testing life components', () => {
    const lifeFieldsProps: Array<ILifeField> = [
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'checkbox',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'textarea',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_2',
            order_asc: 2,
            public_id: '2',
        },
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_3',
            order_asc: 3,
            public_id: '3',
        },
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'html',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_4',
            order_asc: 4,
            public_id: '4',
        },
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'random',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_5',
            order_asc: 5,
            public_id: '5',
        },
        {
            input_default: 'option1,option2,option3',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'dropdown',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_6',
            order_asc: 6,
            public_id: '6',
        },
        {
            input_default: '2024/01/01',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'datepicker',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_7',
            order_asc: 7,
            public_id: '7',
        },
    ];

    const hookCheckboxReturn: ILifeFieldCheckbox = {
        checked: true,
        value: 'true',
        label: 'label',
        helpText: 'help text',
        id: '1',
        handleChange: jest.fn()
    };

    const hookTextInputReturn: ILifeFieldInput = {
        inputValue: 'value',
        label: 'label',
        placeHolder: 'placeholder',
        id: '1',
        handleChange: jest.fn()
    };

    const hookSelectReturn: ILifeFieldSelect = {
        inputValue: 'value',
        label: 'label',
        placeholder: 'placeholder',
        options: [],
        id: '1',
        handleChange: jest.fn()
    };

    const hookDatePickerReturn: ILifeFieldDatePicker = {
        date: 'value',
        placeHolder: 'placeholder',
        id: '1',
        value: '2024/01/01',
        handleChange: jest.fn()
    };

    beforeEach(() => {
        useLifeFieldCheckboxMock.mockReturnValue(hookCheckboxReturn);
        useLifeFieldTextInputMock.mockReturnValue(hookTextInputReturn);
        useLifeFieldSelectMock.mockReturnValue(hookSelectReturn);
        useLifeFieldDatePickerMock.mockReturnValue(hookDatePickerReturn);
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        useGetDatePickerLanguageMock.mockReturnValue({});
        useGetAppSettingDataMock.mockReturnValue('en');
    });

    test('Rendering life checkbox components', () => {
        const {container} = render(<LifeFields lifeFields={lifeFieldsProps}/>);
        expect(container.getElementsByClassName('life-element-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('life-element-checkbox-container').length).toBe(1);
        expect(container.getElementsByClassName('life-element-text').length).toBe(1);
        expect(container.getElementsByClassName('life-element-text-container').length).toBe(1);
        expect(container.getElementsByClassName('life-element-textarea').length).toBe(1);
        expect(container.getElementsByClassName('life-element-textarea-container').length).toBe(1);
        expect(container.getElementsByClassName('life-element-html').length).toBe(1);
        expect(container.getElementsByClassName('life-element-html-container').length).toBe(1);
        expect(container.getElementsByClassName('life-element-date-picker').length).toBe(1);
        expect(container.getElementsByClassName('life-element-date-picker-container').length).toBe(1);
        expect(container.getElementsByClassName('life-element-select').length).toBe(1);
        expect(container.getElementsByClassName('life-element-select-container').length).toBe(1);
    });


    test('Not rendering life checkbox components', () => {
        const nonLifeFieldsProps: Array<ILifeField> = [
            {
                input_default: '',
                input_label: 'label',
                input_placeholder: 'placeholder',
                input_required: true,
                input_type: 'random',
                input_regex: null,
                location: 'customer_info',
                meta_data_field: 'test_meta_data_field_5',
                order_asc: 5,
                public_id: '5',
            },
        ];
        const {container} = render(<LifeFields lifeFields={nonLifeFieldsProps}/>);
        expect(container.getElementsByClassName('life-element-checkbox').length).toBe(0);
        expect(container.getElementsByClassName('life-element-checkbox-container').length).toBe(0);
        expect(container.getElementsByClassName('life-element-text').length).toBe(0);
        expect(container.getElementsByClassName('life-element-text-container').length).toBe(0);
        expect(container.getElementsByClassName('life-element-textarea').length).toBe(0);
        expect(container.getElementsByClassName('life-element-textarea-container').length).toBe(0);
        expect(container.getElementsByClassName('life-element-html').length).toBe(0);
        expect(container.getElementsByClassName('life-element-html-container').length).toBe(0);
    });
});
