import React from 'react';
import {CartItem} from 'src/components';
import {ICartItemsProps} from 'src/types';

export function CartItems(props: ICartItemsProps): React.ReactElement {
    return (
        <ul className="cart-items">
            {props.line_items.map(item =>
                <CartItem
                    key={item.product_data.line_item_key}
                    line_item={item}
                    onUpdateQuantity={props.onUpdateQuantity}
                    quantityDisabled={props.quantityDisabled}
                    showLineItemProperties={props.showLineItemProperties}
                />
            )}
        </ul>
    );
}
