import {render} from '@testing-library/react';

import {LifeFieldCheckbox} from 'src/components';
import {ILifeFieldCheckbox, ILifeFieldProps} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {useLifeFieldCheckbox, useGetIsLoadingExceptSections} from 'src/hooks';

jest.mock('src/hooks/useLifeFieldCheckbox');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useLifeFieldCheckboxMock = mocked(useLifeFieldCheckbox, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('testing life checkbox component', () => {
    const lifeFields: Array<ILifeField> = [
        {
            input_default: '',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'checkbox',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: null,
            input_label: null,
            input_placeholder: null,
            input_required: true,
            input_type: 'checkbox',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 2,
            public_id: '2',
        }
    ];

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Rendering life checkbox component', () => {
        const props: ILifeFieldProps = {
            key: '1',
            lifeField: lifeFields[0],
        };

        const hookReturn: ILifeFieldCheckbox = {
            checked: true,
            value: 'true',
            label: 'label',
            helpText: 'help text',
            id: '1',
            handleChange: jest.fn()
        };
        useLifeFieldCheckboxMock.mockReturnValue(hookReturn);
        const {container} = render(<LifeFieldCheckbox {...props}/>);
        expect(container.getElementsByClassName('life-field-checkbox').length).toBe(1);
    });

    test('Rendering life checkbox component with optional values', () => {
        const optionalProps: ILifeFieldProps = {
            key: '2',
            lifeField: lifeFields[1],
        };

        const optionalHookReturn: ILifeFieldCheckbox = {
            checked: true,
            value: '',
            label: '',
            helpText: '',
            id: '2',
            handleChange: jest.fn()
        };
        useLifeFieldCheckboxMock.mockReturnValue(optionalHookReturn);
        const {container} = render(<LifeFieldCheckbox {...optionalProps}/>);
        expect(container.getElementsByClassName('life-field-checkbox').length).toBe(1);
    });
});
