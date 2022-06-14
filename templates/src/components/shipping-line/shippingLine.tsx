import React from 'react';
import { FieldRadio, LockedSection, ConditionalWrap } from 'src/components';
import { useGetShippingLinesData } from 'src/hooks';
import { Price } from '@boldcommerce/stacks-ui';
import { IShippingLineProps } from 'src/types';

export function ShippingLine(props: IShippingLineProps): React.ReactElement {
    const { shippingLines, selectedLine, handleChange, shippingLinesLength, noShippingAreaText, formattedPrice } = useGetShippingLinesData();

    return (
        <>
            {shippingLinesLength > 0 ? (
                <ConditionalWrap condition={!!props.showNoRatesAsAlert} className="shipping-line__block">
                    {shippingLines.map(line =>
                        <div className="shipping_line__items" key={line.id}>
                            <FieldRadio className="shipping_line__items-description"
                                id={`${line.id}`}
                                label={line.description}
                                name="radio-shipping-group"
                                value={line.id}
                                checked={selectedLine?.id === line.id}
                                handleChange={handleChange}
                            />
                            <Price className="shipping_line__items-amount" amount={line.amount} moneyFormatString={formattedPrice} />
                        </div>
                    )}
                </ConditionalWrap>
            ) : (
                props.showNoRatesAsAlert ? (
                    <div className="flash-error__container">
                        <span className="flash-error__text">{noShippingAreaText}</span>
                    </div>
                ) : (
                    <LockedSection
                        classNameSection="shipping-line__no-valid-address"
                        className="shipping-line__no-valid-address-label"
                        text={noShippingAreaText}
                    />
                )
            )}
        </>
    );
}
