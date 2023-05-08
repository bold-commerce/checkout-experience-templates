import React from 'react';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

export function DisplayAddress(props: IAddress & {testDataId: string}): React.ReactElement {
    return (
        <div className={'display-address-container'} data-testid={`display-${props.testDataId}-address-container`}>
            <div className={'display-address-row'} data-testid={`display-${props.testDataId}-address-full-name`}>
                <span data-testid={`display-${props.testDataId}-address-first-name`}>{props.first_name}</span>
                {' '}
                <span data-testid={`display-${props.testDataId}-address-last-name`}>{props.last_name}</span>
            </div>
            {
                props.business_name &&
                <div className={'display-address-row'} data-testid={`display-${props.testDataId}-address-business-name`}>
                    {props.business_name}
                </div>
            }
            <div className={'display-address-row'} data-testid={`display-${props.testDataId}-address-line-1`}>
                {props.address_line_1}
            </div>
            {
                props.address_line_2 &&
                <div className={'display-address-row'} data-testid={`display-${props.testDataId}-address-line-2`}>
                    {props.address_line_2}
                </div>
            }
            {
                <div className={'display-address-row'}>
                    <span data-testid={`display-${props.testDataId}-address-city`}>{props.city}</span>
                    {' '}
                    <span data-testid={`display-${props.testDataId}-address-province-code`}>{props.province_code}</span>
                    {' '}
                    <span data-testid={`display-${props.testDataId}-address-postal-code`}>{props.postal_code}</span>
                </div>
            }
            {
                <div className={'display-address-row'} data-testid={`display-${props.testDataId}-address-country`}>
                    {props.country}
                </div>
            }
        </div>
    );
}
