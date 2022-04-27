import React from 'react';
import {FieldRadio, LockedSection} from 'src/components';
import {useGetShippingLinesData} from 'src/hooks';
import {Price} from '@boldcommerce/stacks-ui';

export function ShippingLine(): React.ReactElement {
    const {shippingLines, selectedLine, handleChange, shippingLinesLength, noShippingAreaText, formattedPrice} = useGetShippingLinesData();

    return (
        <>
            {
                (shippingLinesLength> 0) ?
                    shippingLines && Array.isArray(shippingLines) && shippingLines.map((line, index) =>
                        <div className={'shipping_line__items'} key={`shipping-line-${index}`}>
                            <FieldRadio className={'shipping_line__items-description'}
                                id={line.id}
                                label={line.description}
                                name={'radio-shipping-group'}
                                value={line.id}
                                checked={selectedLine.id === line.id}
                                handleChange={handleChange}
                            />
                            <Price className={'shipping_line__items-amount'} amount={line.amount} moneyFormatString={formattedPrice}/>
                        </div>
                    ):
                    <LockedSection classNameSection={'shipping-line__no-valid-address'}
                        className={'shipping-line__no-valid-address-label'}
                        text={noShippingAreaText}/>
            }
        </>
    );
}
