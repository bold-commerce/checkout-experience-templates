import React from 'react';
import {
    LifeFieldText,
    LifeFieldCheckbox,
    LifeFieldHtml,
    LifeFieldTextarea,
    LifeFieldSelect,
    LifeFieldDatePicker
} from 'src/components';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {LifeInputTypeConstants} from 'src/constants';
import {ILifeFieldsProps} from 'src/types';
import cn from 'classnames';

export function LifeFields(props: ILifeFieldsProps): React.ReactElement {
    const sortedLifeFields = [...props.lifeFields];
    sortedLifeFields.sort((a,b) => {
        return a.order_asc - b.order_asc;
    });

    return (
        <div className={cn(['life-fields', props.className])}>
            {
                sortedLifeFields.map((lifeField: ILifeField) => {
                    return (
                        {
                            [LifeInputTypeConstants.TEXT] : <LifeFieldText lifeField={lifeField} key={lifeField.public_id}/>,
                            [LifeInputTypeConstants.TEXTAREA] : <LifeFieldTextarea lifeField={lifeField} key={lifeField.public_id}/>,
                            [LifeInputTypeConstants.CHECKBOX] : <LifeFieldCheckbox lifeField={lifeField} key={lifeField.public_id}/>,
                            [LifeInputTypeConstants.HTML] : <LifeFieldHtml lifeField={lifeField} key={lifeField.public_id}/>,
                            [LifeInputTypeConstants.DROPDOWN] : <LifeFieldSelect lifeField={lifeField} key={lifeField.public_id}/>,
                            [LifeInputTypeConstants.DATEPICKER] : <LifeFieldDatePicker lifeField={lifeField} key={lifeField.public_id}/>,
                        } [lifeField.input_type]
                    );
                })
            }
        </div>
    );
}
