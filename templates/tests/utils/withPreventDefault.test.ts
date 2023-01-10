import { withPreventDefault } from 'src/utils';

describe('Testing withPreventDefault', () => {
    test("When returned function is invoked with an event, then the event's preventDefault method is called.", () => {
        const mockEvent = { preventDefault: jest.fn(() => { /* no-op */ }) };

        const wrappedTestFunction = withPreventDefault(jest.fn);
        wrappedTestFunction(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('When the returned function is invoked, then it calls the wrapped function', () => {
        const mockFunction = jest.fn();

        const wrappedTestFunction = withPreventDefault(mockFunction);
        wrappedTestFunction({ preventDefault: () => { /* no-op */ } });

        expect(mockFunction).toHaveBeenCalled();
    });

    test('Does not called the wrapped function before the returned function is called', () => {
        const mockFunction = jest.fn();

        withPreventDefault(mockFunction);

        expect(mockFunction).not.toHaveBeenCalled();
    });
});