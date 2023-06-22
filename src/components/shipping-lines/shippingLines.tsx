import React from 'react';
import {FieldSection, LockedSection, LoadingSection, ShippingLine, ConditionalWrap} from 'src/components';
import {useGetGeneralSettingCheckoutFields, useGetSelectShippingLine, useGetShippingLines} from 'src/hooks';
import {IShippingLinesProps} from 'src/types';
import {Constants} from 'src/constants';

export function ShippingLines(props: IShippingLinesProps): React.ReactElement {
    const {loading, isValidAddress, notValidText, fieldSectionText, taxShippingText} = useGetShippingLines();
    const selectedLine = useGetSelectShippingLine();
    const displayShippingAlert = props.theme === Constants.THREE_PAGE && useGetGeneralSettingCheckoutFields('tax_shipping');

    return (
        <div className="shipping-lines">
            <FieldSection title={fieldSectionText} className="shipping-lines__FieldSection" showTitle>
                {!isValidAddress ? (
                    <LockedSection
                        classNameSection="shipping-line__no-valid-address"
                        className="shipping-line__no-valid-address-label"
                        text={notValidText}
                    />
                ) : <>
                    <LoadingSection className="shipping-line__no-valid-address" isLoading={loading} />
                    {!loading && (
                        <ConditionalWrap condition={!props.showNoRatesAsAlert} className="shipping-line__block">
                            <ShippingLine showNoRatesAsAlert={props.showNoRatesAsAlert} theme={props.theme} />
                        </ConditionalWrap>
                    )}
                </>}
            </FieldSection>
            {displayShippingAlert && selectedLine.amount > 0 &&
                <div className="flash-warning__container">
                    <span className="flash-warning__text">{taxShippingText}</span>
                </div>
            }
        </div>
    );
}
