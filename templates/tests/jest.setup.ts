import {initialDataMock, stateMock} from 'src/mocks';

jest.mock('@bugsnag/js');
jest.mock('src/constants/orderInitialization', () => ({
    defaultOrderInitialization: {
        ...stateMock,
        errors: [],
    },
}));

window.bugsnagApiKey = '';
window.enableConsole = false;
window.initializedOrder = {data: initialDataMock};
