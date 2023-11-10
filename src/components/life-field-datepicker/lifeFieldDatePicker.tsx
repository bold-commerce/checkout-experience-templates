import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldDatePicker} from 'src/components';
import {useLifeFieldDatePicker} from 'src/hooks';

export function LifeFieldDatePicker(props: ILifeFieldProps): React.ReactElement {
    const {date, value, placeHolder, id, errorMessage, handleChange} = useLifeFieldDatePicker(props.lifeField);

    return (
        <div id={`life-element-date-picker-container-${id}`} className={'life-element-date-picker-container'} data-testid={`life-element-date-picker-container-${id}`} key={id}>
            <FieldDatePicker
                name={id}
                date={date}
                placeholder={placeHolder}
                className='life-element-date-picker'
                handleChange={handleChange}
                id={`life-element-date-picker-${id}`}
                value={value}
                errorMessage={errorMessage}
            />
        </div>
    );
}
