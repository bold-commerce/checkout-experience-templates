import {render} from '@testing-library/react';
import {HeaderHelmet} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetAppSettingData} from 'src/hooks';
import {waitFor} from '@testing-library/react';
import {HelmetProvider} from 'react-helmet-async';

jest.mock('src/hooks/useGetAppSettingData');
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing GuestCustomer component', () => {

    beforeEach(() => {
        useGetAppSettingDataMock.mockReturnValue('en');
    });

    test('Rendering the component with isMobile = false', async () => {
        const context = {};
        render(<HelmetProvider context={context}><HeaderHelmet title='test'/></HelmetProvider>);
        await waitFor(() => expect(document.title).toEqual('test'));

    });
});
