import { baseApi } from "./baseApi";
import { TQueryParam } from "./serviceApi";

const transactionManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (transactionInfo) => ({
        url: "/transactions",
        method: "POST",
        body: transactionInfo,
      }),
      invalidatesTags: ["transaction"],
    }),
    getAllTransaction: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/transactions",
          method: "GET",
          params: params,
        };
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return {
          response,
        };
      },
      providesTags: ["transaction"],
    }),
  }),
});

export const { useCreateTransactionMutation, useGetAllTransactionQuery } =
  transactionManagementApi;
