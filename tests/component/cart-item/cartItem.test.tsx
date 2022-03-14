import {IApplicationStateLineItem} from 'src/types';
import {stateMock} from 'src/mocks';
import {render} from '@testing-library/react';
import {CartItem} from 'src/components';


describe('Testing CartItem component', () => {
    const lineItem : IApplicationStateLineItem = stateMock.data.application_state.line_items[0];
    const lineItemVariant : IApplicationStateLineItem = {
        ...lineItem,
        product_data: {
            ...lineItem.product_data,
            title: 'Variant Title'
        }
    }

    const dataArray = [
        {
            name: 'rendering the cart item component without variant',
            props: { line_item: lineItem },
            counters: { variant_title: 0 }
        }, {
            name: 'rendering the cart item component with a variant',
            props: { line_item: lineItemVariant },
            counters: { variant_title: 1 }
        }
    ]

    test.each(dataArray)('$name', ({counters, props}) => {
        const {container} = render(<CartItem {...props}/>);
        expect(container.getElementsByClassName('cart-item').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__text').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__title').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__variant-title').length).toBe(counters.variant_title);
        expect(container.getElementsByClassName('cart-item__price-quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-container').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-number').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__price').length).toBe(1);

    });

});
