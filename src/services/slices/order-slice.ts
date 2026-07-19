import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => orderBurgerApi(ingredientIds)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        const { order } = action.payload;
        state.orderRequest = false;
        state.orderModalData = {
          _id: order._id,
          status: order.status,
          name: order.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          number: order.number,
          ingredients: action.meta.arg
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось создать заказ';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload ?? null;
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export const {
  selectOrderRequest,
  selectOrderModalData,
  selectOrderByNumber,
  selectOrderError
} = orderSlice.selectors;

export default orderSlice.reducer;
