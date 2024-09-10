import { baseApi } from "./baseApi";
import { TQueryParam } from "./serviceApi";

const reviewManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (reviewInfo) => ({
        url: "/reviews",
        method: "POST",
        body: reviewInfo,
      }),
      invalidatesTags: ["review"],
    }),
    getAllReview: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/reviews",
          method: "GET",
        };
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return {
          response,
        };
      },
      providesTags: ["review"],
    }),
  }),
});

export const { useGetAllReviewQuery, useCreateReviewMutation } =
  reviewManagementApi;
