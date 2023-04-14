import React from 'react';
import {FieldSection, LockedSection, LoadingSection, ShippingLine, ConditionalWrap} from 'src/components';
import {useGetShippingLines} from 'src/hooks';
import {IShippingLinesProps} from 'src/types';

export function ShippingLines(props: IShippingLinesProps): React.ReactElement {
    const {loading, isValidAddress, notValidText, fieldSectionText} = useGetShippingLines();

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
                            <ShippingLine showNoRatesAsAlert={props.showNoRatesAsAlert} />
                        </ConditionalWrap>
                    )}
                </>}
            </FieldSection>
        </div>
    );
}
