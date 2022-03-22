import {initialDataMock, stateMock} from 'src/mocks';

jest.mock('src/constants/orderInitialization', () => ({
    defaultOrderInitialization: {
        ...stateMock,
        errors: [],
    },
 }));

window.initializedOrder = {data: initialDataMock};
