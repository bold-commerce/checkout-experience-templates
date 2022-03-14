import {IEventType, IFrontEndEvent} from 'src/types';
import {useGetTimestamp} from 'src/hooks';

export function useSendEvent(events: string | IFrontEndEvent): void {
    const storeLoadTimesLocally = window.storeLoadTimesLocally;
    const eventUrl = window.location.href;
    const apiCallUrl = eventUrl.substring(0, eventUrl.indexOf('experience')+10)+'/event';
    const publicOrderId = window.publicOrderId;
    let timestamps: IFrontEndEvent = {};

    if (storeLoadTimesLocally) {
        if (typeof events === 'string') {
            timestamps[events] = useGetTimestamp();
        } else if (typeof timestamps === 'object') {
            timestamps = {...events} as IFrontEndEvent;
        }

        if (timestamps) {
            const postEvent: IEventType = {
                'publicOrderId': publicOrderId,
                'timestamps': timestamps
            };

            fetch(apiCallUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postEvent)
            });
        }
    }
}
