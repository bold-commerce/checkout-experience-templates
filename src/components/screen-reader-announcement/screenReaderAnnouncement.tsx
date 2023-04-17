import React, {HTMLProps} from 'react';
import {Constants} from 'src/constants';
import {IScreenReaderAnnouncementProps} from 'src/types';

export function ScreenReaderAnnouncement(props: IScreenReaderAnnouncementProps & HTMLProps<HTMLParagraphElement>): React.ReactElement {
    const {content, assertiveness, ...rest} = props;
    return (
        <p
            {...rest}
            className='screen-reader-announcement'
            aria-live={assertiveness || Constants.ARIA_LIVE_POLITE}
            role='log'
        >
            {content}
        </p>
    );
}
