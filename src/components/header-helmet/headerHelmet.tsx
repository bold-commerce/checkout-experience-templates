import React from 'react';
import {useGetAppSettingData} from 'src/hooks';
import {Helmet} from 'react-helmet-async';
import {IHeaderHelmet} from 'src/types';

export function HeaderHelmet({title}: IHeaderHelmet): React.ReactElement {
    const language = useGetAppSettingData('languageIso') as string;
    return (
        <Helmet htmlAttributes={{lang: language}}>
            <title>{title}</title>
        </Helmet>
    );
}
