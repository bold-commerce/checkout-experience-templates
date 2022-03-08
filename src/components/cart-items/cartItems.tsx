import React from 'react';
import {CartItem} from 'src/components';
import {ICartItemsProps} from 'src/types';

export function CartItems(props: ICartItemsProps): React.ReactElement {
    return (
        <ul className={'cart-items'}>
            {
                props.line_items.map((item, index: number) => {
                    return (<CartItem key={`item-${index}`} line_item={item}></CartItem>);
                })
            }
        </ul>
    );
}
