import React from 'react';
import {FieldSection, LockedSection, LoadingSection, ShippingLine} from 'src/components';
import {useGetShippingLines} from 'src/hooks';

export function ShippingLines(): React.ReactElement {
    const {loading, isValidAddress, notValidText, fieldSectionText} = useGetShippingLines();

    const shippingLinesComponent = (
        <>
            <LoadingSection className={'shipping-line__no-valid-address'} isLoading={loading} />
            {
                !loading && <div className={'shipping-line__block'}>
                    <ShippingLine/>
                </div>
            }
        </>
    );

    return (
        <div className={'shipping-lines'}>
            <FieldSection title={fieldSectionText} className={'shipping-lines__FieldSection'} showTitle={true}>
                {
                    (!isValidAddress) ?
                        <LockedSection classNameSection={'shipping-line__no-valid-address'}
                            className={'shipping-line__no-valid-address-label'}
                            text={notValidText}/>
                        : shippingLinesComponent
                }
            </FieldSection>
        </div>
    );
}
