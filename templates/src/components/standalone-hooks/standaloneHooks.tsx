import React from 'react';
import {executeHooks} from 'src/utils';

export function StandaloneHooks(): React.ReactElement {
    executeHooks();
    return (<></>);
}
