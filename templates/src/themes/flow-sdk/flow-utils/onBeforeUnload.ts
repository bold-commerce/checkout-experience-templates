import {hasOnGoingRequests} from 'src/themes/flow-sdk/manageFlowState';

export function onBeforeUnload(event: BeforeUnloadEvent): null|string {
    const onGoingRequestHappening = hasOnGoingRequests();
    if (onGoingRequestHappening) {
        return (event.returnValue = 'Do you want to leave the site? Changes you made may not be saved.');
    }

    return null;
}
