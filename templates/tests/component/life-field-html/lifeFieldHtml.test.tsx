import {render, screen} from '@testing-library/react';

import {LifeFieldHtml} from 'src/components';
import {ILifeFieldProps} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

describe('testing life html component', () => {
    const lifeFields: Array<ILifeField> = [
        {
            input_default: '<a href="https://test-shop.alias.com/">Learn about our return policy.</a>',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'html',
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
            input_type: 'html',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        }
    ];

    test('Rendering life html component', () => {

        const props: ILifeFieldProps = {
            key: '1',
            lifeField: lifeFields[0],
        };
        const {container} = render(<LifeFieldHtml {...props}/>);

        expect(container.getElementsByClassName('life-field-html').length).toBe(1);
        expect(container.getElementsByClassName('life-field-html-link').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByText('Learn about our return policy.');
        expect(element.href).toBe('https://test-shop.alias.com/');
    });

    test('Rendering life html component with optional values', () => {

        const optionalProps: ILifeFieldProps = {
            key: '2',
            lifeField: lifeFields[1],
        };

        const {container} = render(<LifeFieldHtml {...optionalProps}/>);

        expect(container.getElementsByClassName('life-field-html').length).toBe(1);
        expect(container.getElementsByClassName('life-field-html-link').length).toBe(1);
        const element: HTMLAnchorElement = screen.getByTestId('2-life-field-html');
        expect(element.href).toBe(undefined);

    });
});
