import {render, screen} from '@testing-library/react';

import {ILifeFieldDatePicker, ILifeFieldProps} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    useGetAppSettingData,
    useGetDatePickerLanguage,
    useGetIsLoadingExceptSections,
    useLifeFieldDatePicker
} from 'src/hooks';
import {LifeFieldDatePicker} from 'src/components';

jest.mock('src/hooks/useLifeFieldDatePicker');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetDatePickerLanguage');
jest.mock('src/hooks/useGetAppSettingData');
const useLifeFieldDatePickerMock = mocked(useLifeFieldDatePicker, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetDatePickerLanguageMock = mocked(useGetDatePickerLanguage, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('testing life date picker component', () => {
    const testLifeField: ILifeField = {
        input_default: 'default',
        input_label: 'label',
        input_placeholder: 'placeholder',
        input_required: true,
        input_type: 'textarea',
        input_regex: null,
        location: 'customer_info',
        meta_data_field: 'test_meta_data_field',
        order_asc: 1,
        public_id: '1',
    };

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        useGetDatePickerLanguageMock.mockReturnValue({});
        useGetAppSettingDataMock.mockReturnValue('en');
    });

    test('Rendering life textarea component', () => {
        const props: ILifeFieldProps = {
            key: '1',
            lifeField: testLifeField,
        };

        const hookReturn: ILifeFieldDatePicker = {
            date: '2023/10/01',
            placeHolder: 'placeHolder',
            id: '1',
            value: '',
            handleChange: jest.fn()
        };
        useLifeFieldDatePickerMock.mockReturnValue(hookReturn);
        const {container} = render(<LifeFieldDatePicker {...props}/>);
        expect(container.getElementsByClassName('life-element-date-picker').length).toBe(1);
        expect(container.getElementsByClassName('life-element-date-picker-container').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('life-element-date-picker-container-1');
        expect(element.id).toBe('life-element-date-picker-container-1');
    });
});
