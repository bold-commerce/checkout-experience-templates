import React from 'react';
import {FieldSection, FieldCheckbox} from 'src/components';
import {useTaxExemption} from 'src/hooks';
import {Message} from '@boldcommerce/stacks-ui';

export function TaxExemption(): React.ReactElement {
    const {sectionEnabled, checked, value, sectionTitle, label, helpText, messageText, handleChange} = useTaxExemption();

    const renderMessage = () => {
        if (!checked) {
            return null;
        }

        return (<div className={'tax-exempt__message'}><Message data-testid={'tax-exempt-message'} type="info"><p>{messageText}</p></Message></div>);
    };

    const taxSection = sectionEnabled ? (
        <div className={'tax-exempt'}>
            <FieldSection title={sectionTitle} className={'tax-exempt__FieldSection'} showTitle>
                <FieldCheckbox
                    label={label}
                    value={value}
                    helpText={helpText}
                    data-testid={'tax-exempt-checkbox'}
                    checked={checked}
                    handleChange={handleChange}
                />
                {renderMessage()}
            </FieldSection>
        </div>) : (<></>);

    return taxSection;
}
