import React from 'react';
import {useIsUserAuthenticated} from 'src/hooks';
import {LoggedInCustomer, GuestCustomer} from 'src/components';

export function CustomerInformation(): React.ReactElement {
    const isCustomerLoggedIn = useIsUserAuthenticated();

    return isCustomerLoggedIn ? <LoggedInCustomer /> : <GuestCustomer />;
}
