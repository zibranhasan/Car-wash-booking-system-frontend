import { baseApi } from "./baseApi";
import { TQueryParam } from "./serviceApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/signup",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: (userInfo) => ({
        url: "profile",
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
    getProfile: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/profile",
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
      providesTags: ["user"],
    }),
    getAllUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/allUser",
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
      providesTags: ["user"],
    }),
    updateRole: builder.mutation({
      query: (userInfo) => ({
        url: `/userRole/${userInfo.id}`,
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useGetAllUserQuery,
  useUpdateRoleMutation,
} = authApi;
