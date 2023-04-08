import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const URL = "http://localhost:3500";

export const apiSlice = createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({baseUrl:URL}),
    tagTypes:['Todos'],
    endpoints:(builder)=>({
        getTodos:builder.query({
            query:()=>'/todos',
            providesTags:['Todos']
        }),
        addTodo:builder.mutation({
            query:(todo)=>({
                url:'/todos',
                method:'POST',
                body:todo
            }),
            invalidatesTags:['Todos']
        }),
        updateTodo:builder.mutation({
            query:({id})=>({
                url:`/todos/${id}`,
                method:'PATCH',
                body:id
            }),
            invalidatesTags:['Todos']
        }),
       
        deleteTodo:builder.mutation({
            query:({id})=>({
                url:`/todos/${id}`,
                method:'DELETE',
                body:id
            }),
            invalidatesTags:['Todos']
        }),

        toggleAllTodos: builder.mutation({
            query: (completed) => ({
              url: '/todos/toggle_all',
              method: 'PATCH',
              body: { completed },
            }),
            invalidatesTags: ['Todos']
          }),
          deleteAllTodos: builder.mutation({
            query: () => ({
              url: '/todos',
              method: 'DELETE',
            }),
            invalidatesTags: ['Todos']
          }),
    })
})

export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useToggleAllTodosMutation,
    useDeleteAllTodosMutation
} = apiSlice;