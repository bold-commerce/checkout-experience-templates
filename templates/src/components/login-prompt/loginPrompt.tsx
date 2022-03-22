import React from 'react';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useLogin} from 'src/hooks';

export function LoginPrompt(): React.ReactElement {
    const {loginUrl} = useLogin();

    return (
        <span className='LoginPrompt'>
            {getTerm('already_have_an_account',Constants.CUSTOMER_INFO)} <a href='#login' onClick={loginUrl}>{getTerm('log_in', Constants.CUSTOMER_INFO)}</a>
        </span>
    );
}

