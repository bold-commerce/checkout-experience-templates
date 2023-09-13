import React, {useEffect} from 'react';
import {IFieldDatePickerProps} from 'src/types';
import {FieldInput} from 'src/components';
import TinyDatePicker from 'tiny-date-picker';
import 'tiny-date-picker/tiny-date-picker.css';
import {useGetAppSettingData, useGetDatePickerLanguage} from 'src/hooks';

export function FieldDatePicker(props: IFieldDatePickerProps): React.ReactElement {

    const language = useGetDatePickerLanguage();
    const languageIso = useGetAppSettingData('languageIso') as string;

    const onChange = (_, dp) => {
        props.handleChange(dp.state.selectedDate);
    };

    useEffect(() => {
        const datePicker = TinyDatePicker(
            document.querySelector(`[id="${props.id}"]`),
            {
                lang: language,
                mode: 'dp-below',
                format(date) {
                    return date.toLocaleDateString(languageIso, {year: 'numeric', month: 'long', day: 'numeric'});
                },
            },
        ).on({
            select: onChange,
        });

        if (props.date) {
            const date = new Date(props.date);
            if (!isNaN(date.getTime())) {
                datePicker.setState({
                    selectedDate: date,
                });
            }
        }
    }, [languageIso]);

    return (
        <div className={props.className}  data-testid='datepicker-field__container'>
            <FieldInput
                name={props.id}
                value={props.value}
                placeholder={props.placeholder}
                className='date-picker-input'
                id={props.id}
                data-testid={`${props.id}-date-picker-input`}
                errorMessage={props.errorMessage}
                handleChange={props.handleChange}
                readonly={true}
            />
        </div>
    );
}
