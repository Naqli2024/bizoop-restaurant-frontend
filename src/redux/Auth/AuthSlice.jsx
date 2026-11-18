
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthService";
import handleApiError from "../../helpers/helperApiError";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post("/auth/login", payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// GET LOGGED-IN USER
export const getLoggedInUser = createAsyncThunk(
  "auth/getLoggedInUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/auth/me");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post("/auth/logout");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const AuthSlice = createSlice({
  name: "authAdmin",

  initialState: {
    user: null,
    restaurant: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.restaurant = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFullFilled = (state, action) => {
      state.loading = false;
      state.error = null;

      switch (action.type) {
        case login.fulfilled.type:
        case getLoggedInUser.fulfilled.type:
          state.user = action.payload?.data?.user || null;
          state.restaurant = action.payload?.data?.restaurant || null;
          break;

        case logout.fulfilled.type:
          state.user = null;
          state.restaurant = null;
          break;

        default:
          break;
      }
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;

      // Clear local authentication even if logout API fails
      if (action.type === logout.rejected.type) {
        state.user = null;
        state.restaurant = null;
      }
    };

    [login, getLoggedInUser, logout].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFullFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

export const { clearAuth } = AuthSlice.actions;

export default AuthSlice.reducer;
