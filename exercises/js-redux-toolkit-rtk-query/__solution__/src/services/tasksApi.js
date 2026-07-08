import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => 'api/tasks',
    }),
    createTask: builder.mutation({
      query: (body) => ({
        url: 'api/tasks',
        method: 'POST',
        body,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `api/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation } =
  tasksApi;

export default tasksApi;
