import {render} from '@testing-library/react';

import {LifeFields} from 'src/components';
import {ILifeFieldCheckbox, ILifeFieldInput} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {useLifeFieldCheckbox, useGetIsLoadingExceptSections, useLifeFieldTextInput} from 'src/hooks';

jest.mock('src/hooks/useLifeFieldCheckbox');
jest.mock('src/hooks/useLifeFieldTextInput');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useLifeFieldCheckboxMock = mocked(useLifeFieldCheckbox, true);
const useLifeFieldTextInputMock = mocked(useLifeFieldTextInput, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

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

    beforeEach(() => {
        useLifeFieldCheckboxMock.mockReturnValue(hookCheckboxReturn);
        useLifeFieldTextInputMock.mockReturnValue(hookTextInputReturn);
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Rendering life checkbox components', () => {
        const {container} = render(<LifeFields lifeFields={lifeFieldsProps}/>);
        expect(container.getElementsByClassName('life-field-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('life-field-text').length).toBe(1);
        expect(container.getElementsByClassName('life-field-textarea').length).toBe(1);
        expect(container.getElementsByClassName('life-field-html').length).toBe(1);
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
        expect(container.getElementsByClassName('life-field-checkbox').length).toBe(0);
        expect(container.getElementsByClassName('life-field-text').length).toBe(0);
        expect(container.getElementsByClassName('life-field-textarea').length).toBe(0);
        expect(container.getElementsByClassName('life-field-html').length).toBe(0);
    });
});
