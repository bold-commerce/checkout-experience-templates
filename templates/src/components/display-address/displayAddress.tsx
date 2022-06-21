import React from 'react';
import {IAddress} from '@bold-commerce/checkout-frontend-library';

export function DisplayAddress(props: IAddress): React.ReactElement {
    return (
        <div className={'display-address-container'}>
            <div className={'display-address-row'}>
                {props.first_name} {props.last_name}
            </div>
            {
                props.business_name &&
                <div className={'display-address-row'}>
                    {props.business_name}
                </div>
            }
            <div className={'display-address-row'}>
                {props.address_line_1}
            </div>
            {
                props.address_line_2 &&
                <div className={'display-address-row'}>
                    {props.address_line_2}
                </div>
            }
            {
                <div className={'display-address-row'}>
                    {props.city} {props.province_code} {props.postal_code}
                </div>
            }
            {
                <div className={'display-address-row'}>
                    {props.country}
                </div>
            }
        </div>
    );
}
