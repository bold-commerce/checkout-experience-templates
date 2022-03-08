import React from 'react';
import {Price, Image} from '@boldcommerce/stacks-ui';
import classNames from 'classnames';
import {ICartItemProps} from 'src/types';
import {useGetCurrencyInformation} from 'src/hooks';

export function CartItem(props: ICartItemProps): React.ReactElement {
    const {product_data} = props.line_item;
    const imgClasses = classNames(['cart-item__img-container', 'cart-item__img-container--empty']);
    const {formattedPrice} = useGetCurrencyInformation();

    return (
        <li key={'item-' + product_data.id} className={'cart-item'}>
            <Image src={product_data.image_url} alt={product_data.title} className={imgClasses} />
            <div className={'cart-item__text'}>
                <h2 className={'cart-item__title'}>{product_data.title}</h2>
                <p className={'cart-item__variant-title'}>{product_data.description}</p>
            </div>
            <div className={'cart-item__price-quantity'}>
                <div className={'cart-item__quantity-container'}>
                    <div className={'cart-item__quantity'}>
                        <span className={'cart-item__quantity-number'}>{product_data.quantity}</span>
                    </div>
                </div>
                <div className={'cart-item__price'}><Price amount={product_data.total_price} moneyFormatString={formattedPrice} textAlign={'right'} /></div>
            </div>
        </li>
    );
}
