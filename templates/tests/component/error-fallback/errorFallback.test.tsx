import {render} from '@testing-library/react';
import React from 'react';
import {ErrorFallback} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import {mocked} from 'jest-mock';
import {useGetErrorFallback} from 'src/hooks';

const store = Store.initializeStore();
jest.mock('src/hooks/useGetErrorFallback');
const useGetErrorFallbackMock = mocked(useGetErrorFallback, true);

const component =
    <Provider store={store}>
        <ErrorFallback/>
    </Provider>;

test('ErrorFallback exists', () => {
    const { container } = render(component);
    expect(useGetErrorFallbackMock).toHaveBeenCalledTimes(1);
    expect(container.getElementsByClassName('App').length).toBe(1);
    expect(container.getElementsByClassName('error-fallback').length).toBe(1);
    expect(container.getElementsByClassName('overlay__message').length).toBe(1);
});


