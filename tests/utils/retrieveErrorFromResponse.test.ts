import {retrieveErrorFromResponse} from 'src/utils';
import {IApiErrorResponse, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {INewApiErrorWarningResponse} from 'src/types';

describe('Test function retrieveErrorFromResponse', () => {
    const someError: IApiErrorResponse = {
        message: 'some message',
        type: 'some type',
        field: 'some field',
        severity: 'some severity',
        sub_type: 'some sub_type'
    };
    const someApiError: IApiErrorResponse = {
        message: '',
        type: 'api',
        field: '',
        severity: 'critical',
        sub_type: ''
    };
    const someNewError: INewApiErrorWarningResponse = {
        code: '02',
        details: {
            error_message: 'some error message',
            field: 'some field',
        },
        message: 'some new error format generic message',
        type: 'some new type',
    };
    const someNewErrors: INewApiErrorWarningResponse = {
        code: '02',
        details: [{
            error_message: 'some error message',
            field: 'some field',
        }],
        message: 'some new error format generic message',
        type: 'some new type',
    };
    const someNewErrorExpected: IApiErrorResponse = {
        message: 'some error message',
        type: 'validation',
        field: 'some field',
        severity: 'validation',
        sub_type: '',
    };

    const someNewWarning: INewApiErrorWarningResponse = {
        code: '02',
        details: {
            warning_message: 'some warning message',
            field: 'some field',
        },
        message: 'some new warning format generic message',
        type: 'some new type',
    };
    const someNewWarnings: INewApiErrorWarningResponse = {
        code: '02',
        details: [{
            warning_message: 'some warning message',
            field: 'some field',
        }],
        message: 'some new warning format generic message',
        type: 'some new type',
    };
    const someNewWarningExpected: IApiErrorResponse = {
        message: 'some warning message',
        type: 'validation',
        field: 'some field',
        severity: 'validation',
        sub_type: '',
    };

    const dataset = [
        {
            name: 'errors field populated in response',
            response: {
                response: {
                    errors: [
                        someError
                    ],
                },
            },
            expected: [someError],
        },
        {
            name: 'errors field populated in response with new format (only 1 error, no array)',
            response: {
                response: {
                    errors: [
                        someNewError
                    ],
                },
            },
            expected: [someNewErrorExpected],
        },
        {
            name: 'warning field populated in response with new format (only 1 warning, no array)',
            response: {
                response: {
                    errors: [
                        someNewWarning
                    ],
                },
            },
            expected: [someNewWarningExpected],
        },
        {
            name: 'errors field populated in response with new format (array)',
            response: {
                response: {
                    errors: [
                        someNewErrors
                    ],
                },
            },
            expected: [someNewErrorExpected],
        },
        {
            name: 'warning field populated in response with new format (array)',
            response: {
                response: {
                    errors: [
                        someNewWarnings
                    ],
                },
            },
            expected: [someNewWarningExpected],
        },
        {
            name: 'errors field populated with empty array in response',
            response: {
                response: {
                    errors: [],
                },
            },
            expected: [],
        },
        {
            name: 'no errors field in response but error (no `s`)',
            response: {
                status: 401,
                success: false,
                error: {
                    body: {
                        errors: [
                            someError
                        ]
                    }
                },
                response: null,
            },
            expected: [someError],
        },
        {
            name: 'response object empty',
            response: {},
            expected: undefined,
        },
        {
            name: 'response.error object empty',
            response: {
                status: 401,
                success: false,
                error: {},
                response: null,
            },
            expected: undefined,
        },
        {
            name: 'response.error.body object empty',
            response: {
                status: 401,
                success: false,
                error: {
                    body: {}
                },
                response: null,
            },
            expected: undefined,
        },
        {
            name: 'response.error.body.errors object empty',
            response: {
                status: 401,
                success: false,
                error: {
                    body: {
                        errors: []
                    }
                },
                response: null,
            },
            expected: [],
        },
        {
            name: 'response.error object is populated with new API error - no error',
            response: {
                status: 200,
                success: false,
                response: {},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - error undefined',
            response: {
                status: 200,
                success: false,
                error: undefined,
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - empty',
            response: {
                status: 200,
                success: false,
                error: {},
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - any keys',
            response: {
                status: 200,
                success: false,
                error: {
                    test: 'some test string',
                    testint: 2,
                    testbool: true,
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - status undefined',
            response: {
                status: 200,
                success: false,
                error: {
                    status: undefined,
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - only status (0)',
            response: {
                status: 200,
                success: false,
                error: {
                    status: 0,
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - only status (correct)',
            response: {
                status: 200,
                success: false,
                error: {
                    status: 1903,
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - only message (undefined)',
            response: {
                status: 200,
                success: false,
                error: {
                    message: undefined,
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - only message (empty)',
            response: {
                status: 200,
                success: false,
                error: {
                    message: '',
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - only message (correct)',
            response: {
                status: 200,
                success: false,
                error: {
                    message: 'some message',
                },
                response: {data: {}},
            },
            expected: undefined,
        },
        {
            name: 'response.error object is populated with new API error - response.error.message OK & response.error.status OK',
            response: {
                status: 200,
                success: false,
                error: {
                    body: undefined,
                    message: 'some message',
                    name: 'fetchError',
                    status: 1903, //emptyKeysToCheck: apiErrors.emptyKeysToCheck.status
                    statusText: undefined
                },
                response: {data: {}},
            },
            expected: someApiError,
        },
    ];

    test.each(dataset)('$name', ({name, response, expected}) => {
        const result = retrieveErrorFromResponse(response as any as IApiReturnObject);

        expect(result).toEqual(expected);
    });
});
