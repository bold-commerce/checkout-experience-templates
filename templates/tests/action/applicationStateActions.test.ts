import {actionDeleteElement} from 'src/action';
import * as AppActions from 'src/action/appActionType';

describe('Testing Application State Actions', () => {
    const dataSet = [
        { event: AppActions.REMOVE_PAYMENT, id: '123', payloadType: 'id' },
        { event: AppActions.REMOVE_DISCOUNT, id: '123', payloadType: 'code' },
    ];

    test.each(dataSet)(
        'actionDeleteElement ($event, $id, $payloadType)',
        ({event, id, payloadType}) => {
            const actionReturnExpectation = {
                type: event,
                payload: {}
            };
            actionReturnExpectation.payload[payloadType] = id;

            const result = actionDeleteElement(event, id);

            expect(result).toStrictEqual(actionReturnExpectation);
        });

    const unknownDataSet = [
        { event: 'UNKNOWN', id: '123' },
        { event: '', id: '123' },
        { event: AppActions.REMOVE_DISCOUNT, id: '' },
    ];

    test.each(unknownDataSet)(
        'actionDeleteElement undefined events ($event, $id)',
        ({ event, id }) => {
            const result = actionDeleteElement(event, id);

            expect(result).toBeUndefined();
        });


});
