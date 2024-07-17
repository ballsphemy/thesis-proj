import { apiSlice } from './apiSlice';

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesAnalytics: builder.mutation({
      query: () => ({
        url: `/api/analytics/sales`,
        method: 'GET',
      }),
    }),
    getUserAnalytics: builder.mutation({
      query: () => ({
        url: `/api/analytics/users`,
        method: 'GET',
      }),
    }),
    getHighestReviewedProduct: builder.mutation({
      query: () => ({
        url: `/api/analytics/highest-reviewed`,
        method: 'GET',
      }),
    }),
    getOrderStats: builder.mutation({
      query: () => ({
        url: `/api/analytics/orders`,
        method: 'GET',
      }),
    }),
    getProductStats: builder.mutation({
      query: () => ({
        url: `/api/analytics/products`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetSalesAnalyticsMutation,
  useGetUserAnalyticsMutation,
  useGetHighestReviewedProductMutation,
  useGetOrderStatsMutation,
  useGetProductStatsMutation,
} = analyticsApiSlice;  