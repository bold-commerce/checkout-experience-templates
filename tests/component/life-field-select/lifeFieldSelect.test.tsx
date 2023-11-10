import {render, screen} from '@testing-library/react';

import {ILifeFieldProps, ILifeFieldSelect} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {useGetIsLoadingExceptSections, useLifeFieldSelect} from 'src/hooks';
import {LifeFieldSelect} from 'src/components';

jest.mock('src/hooks/useLifeFieldSelect');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useLifeFieldSelectMock = mocked(useLifeFieldSelect, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('testing life field select component', () => {
    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'dropdown',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'dropdown',
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

    test('Rendering life field select component', () => {
        const props: ILifeFieldProps = {
            key: '1',
            lifeField: lifeFields[0],
        };

        const hookReturn: ILifeFieldSelect = {
            inputValue: 'value',
            label: 'label',
            placeholder: 'placeholder',
            options: [],
            id: '1',
            errorMessage: '',
            handleChange: jest.fn()
        };
        useLifeFieldSelectMock.mockReturnValue(hookReturn);
        const {container} = render(<LifeFieldSelect {...props}/>);
        expect(container.getElementsByClassName('life-element-select').length).toBe(1);
        expect(container.getElementsByClassName('life-element-select-container').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('life-element-select-container-1');
        expect(element.id).toBe('life-element-select-container-1');
    });

    test('Rendering life field select component with optional values', () => {
        const optionalProps: ILifeFieldProps = {
            key: '2',
            lifeField: lifeFields[1],
        };

        const optionalHookReturn: ILifeFieldSelect = {
            inputValue: '',
            label: '',
            placeholder: '',
            options: [],
            id: '2',
            errorMessage: '',
            handleChange: jest.fn()
        };
        useLifeFieldSelectMock.mockReturnValue(optionalHookReturn);
        const {container} = render(<LifeFieldSelect {...optionalProps}/>);
        expect(container.getElementsByClassName('life-element-select').length).toBe(1);
        expect(container.getElementsByClassName('life-element-select-container').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('life-element-select-container-2');
        expect(element.id).toBe('life-element-select-container-2');
    });
});
