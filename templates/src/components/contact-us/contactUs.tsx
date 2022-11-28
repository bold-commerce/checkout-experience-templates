import ClassNames from 'classnames';
import React from 'react';

import {useGetContactUs} from 'src/hooks';
import {IContactUsProps} from 'src/types';

export function ContactUs(props: IContactUsProps): React.ReactElement {
    const {needHelp, contactUs} = useGetContactUs();
    const cssClass = ClassNames(['contact-us', 'contact-us__need-help', props.className]);
    const contactUsLink = `mailto:${window.supportEmail}`;

    return (
        <div className={cssClass}>
            {needHelp}
            <a className={'contact-us__contact-link'} href={contactUsLink} target="_blank">{` ${contactUs}`}</a>
        </div>
    );
}
