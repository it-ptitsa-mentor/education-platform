// @ts-check

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// BEGIN (write your solution here)
const tasksApi = createApi({
  reducerPath: "tasks",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/tasks" }),
  endpoints: builder => ({
    getTasks: builder.query({
      query: () => "",
    }),
    addTask: builder.mutation({
      query: task => ({
        method: "POST",
        body: task,
      }),
    }),
    removeTask: builder.mutation({
      query: id => ({
        url: String(id),
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useRemoveTaskMutation,
} = tasksApi

export default tasksApi
// END
