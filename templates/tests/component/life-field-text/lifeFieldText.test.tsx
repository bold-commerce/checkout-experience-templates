import {render, screen} from '@testing-library/react';

import {ILifeFieldInput, ILifeFieldProps} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {useLifeFieldTextInput, useGetIsLoadingExceptSections} from 'src/hooks';
import {LifeFieldText} from 'src/components';

jest.mock('src/hooks/useLifeFieldTextInput');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useLifeFieldTextInputMock = mocked(useLifeFieldTextInput, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);

describe('testing life text component', () => {
    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
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
            input_type: 'text',
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

    test('Rendering life text component', () => {
        const props: ILifeFieldProps = {
            key: '1',
            lifeField: lifeFields[0],
        };

        const hookReturn: ILifeFieldInput = {
            inputValue: 'value',
            label: 'label',
            placeHolder: 'placeholder',
            id: '1',
            handleChange: jest.fn()
        };
        useLifeFieldTextInputMock.mockReturnValue(hookReturn);
        const {container} = render(<LifeFieldText {...props}/>);
        expect(container.getElementsByClassName('life-element-text').length).toBe(1);
        expect(container.getElementsByClassName('life-element-text-container').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('life-element-text-container-1');
        expect(element.id).toBe('life-element-text-container-1');
    });

    test('Rendering life text component with optional values', () => {
        const optionalProps: ILifeFieldProps = {
            key: '2',
            lifeField: lifeFields[1],
        };

        const optionalHookReturn: ILifeFieldInput = {
            inputValue: '',
            label: '',
            placeHolder: '',
            id: '2',
            handleChange: jest.fn()
        };
        useLifeFieldTextInputMock.mockReturnValue(optionalHookReturn);
        const {container} = render(<LifeFieldText {...optionalProps}/>);
        expect(container.getElementsByClassName('life-element-text').length).toBe(1);
        expect(container.getElementsByClassName('life-element-text-container').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('life-element-text-container-2');
        expect(element.id).toBe('life-element-text-container-2');
    });
});
