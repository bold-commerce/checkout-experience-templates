import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldDatePicker} from 'src/components';
import {useLifeFieldDatePicker} from 'src/hooks';

export function LifeFieldDatePicker(props: ILifeFieldProps): React.ReactElement {
    const {date, value, placeHolder, id, errorMessage, handleChange} = useLifeFieldDatePicker(props.lifeField);

    return (
        <div className={'life-field-date-picker'} key={id}>
            <FieldDatePicker
                name={id}
                date={date}
                placeholder={placeHolder}
                className='life-field-date-picker-element'
                handleChange={handleChange}
                id={id}
                value={value}
                data-testid={`${id}-life-field-date-picker-element`}
                errorMessage={errorMessage}
            />
        </div>
    );
}
