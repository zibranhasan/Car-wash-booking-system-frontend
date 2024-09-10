import { baseApi } from "./baseApi";
import { TQueryParam } from "./serviceApi";

const bookingManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingsInfo) => ({
        url: "/bookings",
        method: "POST",
        body: bookingsInfo,
      }),
      invalidatesTags: ["booking"],
    }),
    getBookingsByUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/my-bookings",
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
      providesTags: ["booking", "transaction", "user"],
    }),
    getAllBookings: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/bookings",
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
      providesTags: ["booking"],
    }),
    removeBooking: builder.mutation({
      query: (id) => {
        return {
          url: `/bookings/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsByUserQuery,
  useRemoveBookingMutation,
  useGetAllBookingsQuery,
} = bookingManagementApi;
