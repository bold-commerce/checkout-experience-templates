import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {IEventType, IFrontEndEvent} from 'src/types';
import {useGetTimestamp, useSendEvent} from 'src/hooks';
import MockDate from 'mockdate';

jest.mock('src/hooks/useGetTimestamp');
const useGetTimestampMock = mocked(useGetTimestamp, true);

global.fetch = jest.fn();

describe('Testing hook useSendEvent', () => {
    const expectedURI = 'https://some.url/experience/event';
    let fetchSpy: jest.SpyInstance;
    const mockDateInit = 1646855991347; // Timestamp represents this date: 2022-03-09 19:59:51.347 UTC time
    const mockDateExpectedString = '2022-03-09 13:59:51.347';
    const initFetchMock = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {}
    };
    const dataSet = [
        {
            events: 'testEvent',
            publicOrderId: 'pubOrderIDMonoEvent',
            getTimestamp: 1,
            expectedIEventType: {
                publicOrderId: 'pubOrderIDMonoEvent',
                timestamps: {
                    'testEvent': mockDateExpectedString
                }
            } as IEventType,
        },
        {
            events: {
                'CheckoutExperienceDomLoading': '2022-09-03 15:00:00.000',
                'CheckoutExperienceComplete': '2022-09-03 15:00:00.500',
            } as IFrontEndEvent,
            publicOrderId: 'pubOrderIDMultiEvent',
            getTimestamp: 0,
            expectedIEventType: {
                publicOrderId: 'pubOrderIDMultiEvent',
                timestamps: {
                    'CheckoutExperienceDomLoading': '2022-09-03 15:00:00.000',
                    'CheckoutExperienceComplete': '2022-09-03 15:00:00.500',
                }
            } as IEventType,
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        fetchSpy = jest.spyOn(global, 'fetch');
        MockDate.set(mockDateInit);

        useGetTimestampMock.mockReturnValueOnce(mockDateExpectedString);

        Object.defineProperty(window, 'location', {
            value: {
                href: expectedURI
            }
        });
    });

    afterAll(() => {
        MockDate.reset();
    });

    test.each(dataSet)('rendering the hook properly', ({publicOrderId, events, getTimestamp, expectedIEventType}) => {
        window.publicOrderId = publicOrderId;
        window.storeLoadTimesLocally = true;

        const {result} = renderHook(() => useSendEvent(events));
        initFetchMock.body = JSON.stringify(expectedIEventType);

        expect(useGetTimestampMock).toHaveBeenCalledTimes(getTimestamp);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(expectedURI, initFetchMock);
    });
});
