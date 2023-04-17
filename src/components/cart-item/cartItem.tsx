import React from 'react';
import {Price, Image} from '@boldcommerce/stacks-ui';
import {ICartItemProps} from 'src/types';
import {useGetCurrencyInformation, useCartItem, useGetCartParameters} from 'src/hooks';
import {SemiControlledNumberInput} from '../semi-controlled-number-input/semiControlledNumberInput';
import {getLineItemPropertiesForDisplay} from 'src/utils';
import {Constants} from 'src/constants';

export function CartItem({line_item, quantityDisabled, onUpdateQuantity, showLineItemProperties = true}: ICartItemProps): React.ReactElement {
    const {product_data} = line_item;
    const {formattedPrice} = useGetCurrencyInformation();
    const {
        decrementQuantity: decrementLocalQuantity,
        incrementQuantity: incrementLocalQuantity,
        updateQuantity: commit,
        quantity: localQuantity,
    } = useCartItem(
        line_item,
        quantityDisabled,
        onUpdateQuantity,
    );

    const cartParameters = useGetCartParameters();
    const properties = getLineItemPropertiesForDisplay(product_data.properties, cartParameters);

    return (
        <li className="cart-item">
            <Image src={product_data.image_url} alt={product_data.product_title} className="cart-item__img-container cart-item__img-container--empty" />
            <div className="cart-item__text">
                <h2 className="cart-item__title">{product_data.product_title}</h2>
                {(product_data.title && product_data.title.toLowerCase() !== Constants.DEFAULT_TITLE ) && (
                    <p className="cart-item__variant-title">{product_data.title}</p>
                )}
                {   showLineItemProperties && properties.map((property) => {
                    return <p className='cart-item__property' key={property}>{property}</p>;
                })
                }
            </div>
            <div className="cart-item__price-quantity">
                <div className="cart-item__quantity-container">
                    {onUpdateQuantity ? (
                        <div className="cart-item__quantity-controls">
                            <button
                                id={'quantity-decrease-button'}
                                className="cart-item__quantity-decrease"
                                aria-disabled={quantityDisabled}
                                aria-label="decrement quantity"
                                onClick={decrementLocalQuantity}
                            >
                                -
                            </button>
                            <SemiControlledNumberInput
                                className="cart-item__quantity-input"
                                min={1}
                                value={localQuantity}
                                aria-disabled={quantityDisabled}
                                onCommit={commit}
                            />
                            <button
                                id={'quantity-increase-button'}
                                className="cart-item__quantity-increase"
                                aria-disabled={quantityDisabled}
                                aria-label="increment quantity"
                                onClick={incrementLocalQuantity}
                            >
                                +
                            </button>
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
