import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const billRequest = createAsyncThunk(
  "orders/billRequest",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.patch(
        `/orders/${orderId}/request-bill`
      );
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getBillRequestCashier = createAsyncThunk(
  "getBillRequestCashier",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/orders/bill-requests");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const billGenerated = createAsyncThunk(
  "billGenerated",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(`/bills/${orderId}/generate`);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const collectPayment = createAsyncThunk(
  "collectPayment",
  async ({ Id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.patch(`/bills/${Id}/collect-payment`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const getBillsByCashier = createAsyncThunk(
  "bills/getBillsByCashier",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/bills/cashier/performance");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

const BillSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
    overall: {},
    cashierPerformance: [],
    dateRange: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
    };

    const handleFulFilled = (state, action) => {
      state.loading = false;
      state.error = null;

      switch (action.type) {
        case billRequest.fulfilled.type:
          break;
        case getBillRequestCashier.fulfilled.type:
          state.bills = action.payload?.data || [];
          break;
        case billGenerated.fulfilled.type:
          break;
        case collectPayment.fulfilled.type:
          break;
        case getBillsByCashier.fulfilled.type:
          state.overall = action.payload?.overall || {};
          state.cashierPerformance = action.payload?.cashierPerformance || [];
          state.dateRange = action.payload?.dateRange || {};
          break;
        default:
          break;

      }
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    [billRequest, getBillRequestCashier, billGenerated, collectPayment, getBillsByCashier].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

export default BillSlice.reducer