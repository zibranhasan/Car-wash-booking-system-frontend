import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi";

export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export interface TQueryParam {
  name: string;
  value: string | number;
}
export type Service = {
  photo: string | undefined;
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isDeleted?: boolean; // optional since it has a default value
  createdAt?: Date; // added by timestamps
  updatedAt?: Date; // added by timestamps
};

export interface ServiceResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  data: Service[];
}

const serviceManagementApi = baseApi.injectEndpoints({
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

      transformResponse: (response: ServiceResponse) => {
        return {
          data: response,
        };
      },
      providesTags: ["slot", "transaction"],
    }),
    getAllService: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/services",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["service", "transaction"],
      transformResponse: (response: ServiceResponse) => {
        return {
          data: response,
        };
      },
    }),
    getServiceById: builder.query({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),

    deleteService: builder.mutation({
      query: (id) => {
        return {
          url: `/services/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["service"],
    }),

    updateService: builder.mutation({
      query: (options) => {
        return {
          url: `/services/${options.id}`,
          method: "PUT",
          body: options,
        };
      },
      invalidatesTags: ["service"],
    }),
    createService: builder.mutation({
      query: (options) => {
        return {
          url: "/services",
          method: "POST",
          body: options,
        };
      },
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useGetAllServiceQuery,
  useGetServiceByIdQuery,
  useGetAvailableTimeSlotsQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
  useCreateServiceMutation,
} = serviceManagementApi;
