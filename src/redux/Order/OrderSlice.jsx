
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

/* ====================== GET ORDER BY ID ====================== */

export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/* ====================== ADD DINE IN ====================== */

export const addDineIn = createAsyncThunk(
  "addDineIn",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(
        "/orders/dine-in",
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCaptainReadyKot = createAsyncThunk(
  "getCaptainReadyKot",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/kots/captain/ready");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const getCaptainDashboard= createAsyncThunk(
  "getCaptainDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/orders/captain/dashboard");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const checkOutOrder= createAsyncThunk(
  "checkOutOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.patch(`/orders/${id}/checkout`);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

/* ====================== ORDER SLICE ====================== */

const OrderSlice = createSlice({
  name: "order",

  initialState: {
    order:null,
    readyKot:[],
    dashboard:null,
    loading: false,
    error: null,
    items: [],
  },

  reducers: {
    /* ADD FOOD ITEM */
    addCartItem: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) => i.key === item.key
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push(item);
      }
    },

    /* UPDATE QUANTITY */
    updateCartQty: (state, action) => {
      const { uid, change } = action.payload;

      const item = state.items.find(
        (i) => i.uid === uid
      );

      if (item) {
        item.qty += change;
      }

      state.items = state.items.filter(
        (i) => i.qty > 0
      );
    },

    /* REMOVE ITEM */
    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (i) => i.uid !== action.payload
      );
    },

    /* HOLD / RELEASE ITEM */
    toggleCartHold: (state, action) => {
      const item = state.items.find(
        (i) => i.uid === action.payload
      );

      if (item) {
        item.hold = !item.hold;
      }
    },

    /* CLEAR SENT ITEMS */
    clearSentCartItems: (state) => {
      state.items = state.items.filter(
        (i) => i.hold
      );
    },

    /* CLEAR COMPLETE CART */
    clearCart: (state) => {
      state.items = [];
    },
  },

  /* ====================== API STATES ====================== */

  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulFilled = (state, action) => {
      state.loading = false;
      state.error = null;

      switch (action.type) {
        case getOrderById.fulfilled.type:
          state.order = action.payload?.data || null;
          break;

        case addDineIn.fulfilled.type:
          state.order = action.payload?.data || null;
          break;

        case getCaptainReadyKot.fulfilled.type:
          state.readyKot = action.payload?.data || [];
          break;
        case getCaptainDashboard.fulfilled.type:
          state.dashboard = action.payload;
          break;
         case checkOutOrder.fulfilled.type:
          state.order = action.payload 
          break;
        default:
          break;
      }
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    [getOrderById, addDineIn,getCaptainReadyKot,getCaptainDashboard,checkOutOrder].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

/* ====================== EXPORT ACTIONS ====================== */

export const {
  addCartItem,
  updateCartQty,
  removeCartItem,
  toggleCartHold,
  clearSentCartItems,
  clearCart,
} = OrderSlice.actions;

export default OrderSlice.reducer;
