import {IApplicationStateLineItem, ICartItemProps} from 'src/types';
import {stateMock} from 'src/mocks';
import {render} from '@testing-library/react';
import {CartItem} from 'src/components';
import {counterNames} from 'src/constants';


describe('Testing CartItem component', () => {
    const {one} = counterNames;
    const lineItem : IApplicationStateLineItem = stateMock.data.application_state.line_items[0];
    const props: ICartItemProps = {
        line_item: lineItem
    };

    test('rendering the component successfully', () => {
        const {container} = render(<CartItem {...props}/>);
        expect(container.getElementsByClassName('cart-item').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__text').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__title').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__variant-title').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__price-quantity').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__quantity-container').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__quantity').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__quantity-number').length).toBe(one);
        expect(container.getElementsByClassName('cart-item__price').length).toBe(one);

    });

});
