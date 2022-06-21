/*
export function retrieveErrorFromResponse(response: IApiReturnObject): Array<IApiErrorResponse> {
    const {response: res} = response;
    let {errors} = res as {errors: Array<IApiErrorResponse>} || {};

    if (!errors && response.error && response.error.body && response.error.body.errors) {
        errors = response.error.body.errors as Array<IApiErrorResponse>;
    }

    return errors;
}
 */

import {retrieveErrorFromResponse} from 'src/utils';
import {IApiErrorResponse, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';

describe('Test function retrieveErrorFromResponse', () => {
    const someError: IApiErrorResponse = {
        message: 'some message',
        type: 'some type',
        field: 'some field',
        severity: 'some severity',
        sub_type: 'some sub_type'
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
