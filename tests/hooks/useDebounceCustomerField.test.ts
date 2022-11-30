import { renderHook } from "@testing-library/react-hooks";
import { act } from "@testing-library/react";
import { useDebounceCustomerField, useGetCustomerInfoData } from "src/hooks";
import { mocked } from "jest-mock";
import { stateMock } from "src/mocks";
import { updateCustomer } from "src/library";
import { debounceConstants } from "src/constants";

jest.setTimeout(10000);
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));
jest.mock("src/library");
jest.mock("src/hooks/useGetCustomerInformation");
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const updateCustomerMock = mocked(updateCustomer, true);

describe("Testing hook useDebounceGuestCustomerField", () => {
  const customer = stateMock.data.application_state.customer;

  afterEach(() => {
    (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  const dataSet = [
    {
      firstName: "John",
      lastName: "",
      expected: updateCustomerMock,
    },
    {
      firstName: "John",
      lastName: "",
      expected: updateCustomer,
    },
    {
      firstName: "John",
      lastName: "Doe",
      expected: updateCustomerMock,
    },
    {
      firstName: "John",
      lastName: "Doe",
      expected: updateCustomer,
    },
  ];

  test.each(dataSet)(
    "rendering the hook properly with timeout ($firstName, $lastName, $expected)",
    async ({ firstName, lastName, expected }) => {
      jest.useFakeTimers();
      jest.spyOn(global, "setTimeout");

      const localCustomer = {
        ...customer,
        first_name: firstName,
        last_name: lastName,
      };

      useGetCustomerInfoDataMock.mockReturnValueOnce(localCustomer);

      const { result } = renderHook(() => useDebounceCustomerField());

      act(result.current);

      expect(mockDispatch).toBeCalledTimes(0);
      jest.runAllTimers();

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(expected);
      expect(setTimeout).toBeCalledWith(
        expect.any(Function),
        debounceConstants.DEFAULT_DEBOUNCE_TIME
      );
    }
  );
});
