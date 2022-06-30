import {retrieveErrorFromResponse} from 'src/utils';
import {IApiErrorResponse, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';
import {INewApiErrorWarningResponse} from 'src/types';

describe('Test function retrieveErrorFromResponse', () => {
    const someError: IApiErrorResponse = {
        message: 'some message',
        type: 'some type',
        field: 'some field',
        severity: 'some severity',
        sub_type: 'some sub_type'
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
    ];

    test.each(dataset)('$name', ({name, response, expected}) => {
        const result = retrieveErrorFromResponse(response as any as IApiReturnObject);

        expect(result).toEqual(expected);
    });
});
