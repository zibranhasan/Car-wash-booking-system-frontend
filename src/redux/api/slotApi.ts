import { baseApi } from "./baseApi";
import { Service, TQueryParam } from "./serviceApi";

export interface TimeSlot {
  service: Service; // ID of the service
  date: string; // Date in "YYYY-MM-DD" format
  startTime: string; // Start time in "HH:mm" format
  endTime: string; // End time in "HH:mm" format
  isBooked: string; // Booking status, e.g., "available"
  _id: string; // Unique identifier for the time slot
  createdAt: string; // Timestamp for when it was created
  updatedAt: string; // Timestamp for the last update
  __v: number; // Version key
}

export interface slotResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  data: TimeSlot[];
}

const slotManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableTimeSlots: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/slots/availability",
          method: "GET",
          params: params,
        };
      },

      transformResponse: (response: slotResponse) => {
        return {
          response,
        };
      },
      providesTags: ["slot"],
    }),
    getAllSlots: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/servicess/slots",
          method: "GET",
          params: params,
        };
      },

      transformResponse: (response: slotResponse) => {
        return {
          response,
        };
      },
      providesTags: ["slot"],
    }),
    updateSlots: builder.mutation({
      query: (options) => {
        return {
          url: `/services/slots/${options.id}`,
          method: "PUT",
          body: options,
        };
      },
      invalidatesTags: ["slot"],
    }),
    createSlots: builder.mutation({
      query: (options) => {
        return {
          url: "/services/slots",
          method: "POST",
          body: options,
        };
      },
      invalidatesTags: ["slot"],
    }),
    deleteSlots: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/slots/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["slot"],
    }),
  }),
});

export const {
  useGetAvailableTimeSlotsQuery,
  useGetAllSlotsQuery,
  useUpdateSlotsMutation,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} = slotManagementApi;
