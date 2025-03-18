import React from 'react';
import {FieldRadio, LockedSection, ConditionalWrap} from 'src/components';
import {useAppSelector, useGetShippingLinesData, useGetShippingLinesDataNoDebounce} from 'src/hooks';
import {Price} from '@boldcommerce/stacks-ui';
import {IShippingLineProps} from 'src/types';
import ClassNames from 'classnames';
import {Constants} from 'src/constants';

export function ShippingLine(props: IShippingLineProps): React.ReactElement {
    const useDebounce = props.theme != Constants.THREE_PAGE;
    const {shippingLines, selectedLine, handleChange, shippingLinesLength, noShippingAreaText, formattedPrice, useShippingLineCode} =
        useDebounce ? useGetShippingLinesData() : useGetShippingLinesDataNoDebounce();
    const displayExchangeRate: number = useAppSelector((state) => state.data.application_state?.display_exchange_rate);

    return (
        <>
            {shippingLinesLength > 0 ? (
                <ConditionalWrap condition={!!props.showNoRatesAsAlert} className="shipping-line__block">
                    {shippingLines.map((line, index) => {
                        const css = ClassNames([
                            'shipping_line__items',
                            {'shipping_line__items-border': index > 0},
                        ]);
                        return (
                            <div className={css} key={line.id}>
                                <FieldRadio className="shipping_line__items-description"
                                    id={`${useShippingLineCode ? line.code : line.id}`}
                                    label={line.description}
                                    name="radio-shipping-group"
                                    value={useShippingLineCode ? line.code : line.id}
                                    dataTestId={`shipping-lines-${useShippingLineCode ? line.code : line.id}`}
                                    checked={useShippingLineCode ? (selectedLine?.code === line.code) : (selectedLine?.id === line.id)}
                                    handleChange={handleChange}
                                />
                                <Price className="shipping_line__items-amount" amount={displayExchangeRate ? displayExchangeRate * line.amount : line.amount}
                                    moneyFormatString={formattedPrice}/>
                            </div>
                        );
                    }
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
