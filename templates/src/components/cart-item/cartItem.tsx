import React from 'react';
import { Price, Image} from '@boldcommerce/stacks-ui';
import { ICartItemProps } from 'src/types';
import { useGetCurrencyInformation, useCartItem } from 'src/hooks';
import { SemiControlledNumberInput } from '../semi-controlled-number-input/semiControlledNumberInput';

export function CartItem(props: ICartItemProps): React.ReactElement {
    const { product_data } = props.line_item;
    const { formattedPrice } = useGetCurrencyInformation();
    const {
        decrementQuantity: decrementLocalQuantity,
        incrementQuantity: incrementLocalQuantity,
        updateQuantity: commit,
        quantity: localQuantity,
    } = useCartItem(
        props.line_item,
        props.onUpdateQuantity,
    );

    return (
        <li className="cart-item">
            <Image src={product_data.image_url} alt={product_data.title} className="cart-item__img-container cart-item__img-container--empty" />
            <div className="cart-item__text">
                <h2 className="cart-item__title">{product_data.product_title}</h2>
                {(product_data.title && product_data.title !== 'Default Title' ) && (
                    <p className="cart-item__variant-title">{product_data.title}</p>
                )}
            </div>
            <div className="cart-item__price-quantity">
                <div className="cart-item__quantity-container">
                    {props.onUpdateQuantity ? (
                        <div className="cart-item__quantity-controls">
                            <button className="cart-item__quantity-decrease" disabled={props.quantityDisabled} aria-label="decrement quantity" onClick={decrementLocalQuantity}>-</button>
                            <SemiControlledNumberInput
                                className="cart-item__quantity-input"
                                min={1}
                                value={localQuantity}
                                disabled={props.quantityDisabled}
                                onCommit={commit}
                            />
                            <button className="cart-item__quantity-increase" disabled={props.quantityDisabled} aria-label="increment quantity" onClick={incrementLocalQuantity}>+</button>
                        </div>
                    ) : (
                        <div className="cart-item__quantity">
                            <span className="cart-item__quantity-number">{localQuantity}</span>
                        </div>
                    )}
                </div>
                <div className="cart-item__price"><Price amount={product_data.total_price} moneyFormatString={formattedPrice} textAlign="right" /></div>
            </div>
        </li>
    );
}
