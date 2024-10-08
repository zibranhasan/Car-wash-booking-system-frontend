import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://car-washing-backend-coral.vercel.app/api",
  // baseUrl: "http://localhost:5000/api",
  // credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    // console.log(token);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["service", "booking", "slot", "transaction", "user", "review"],
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
