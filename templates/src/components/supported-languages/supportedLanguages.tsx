import React from 'react';
import {useSupportedLanguages} from 'src/hooks';
import {FieldSelect} from 'src/components';

export function SupportedLanguages(): React.ReactElement {

    const {languagesOptions, value , handleChange} = useSupportedLanguages();
    return (

        <div className={'supported-language__container'}>
            {
                (languagesOptions && languagesOptions.length > 1) ?
                    <FieldSelect
                        className={'supported-languages-select-field'}
                        data-testid='supported-language-input-select'
                        id={'supported-languages'}
                        placeholder={''}
                        isPlaceholderDisabled={true}
                        handleChange={handleChange}
                        value={value}
                        options={languagesOptions}
                    />
                    : null
            }
        </div>

    );
}
