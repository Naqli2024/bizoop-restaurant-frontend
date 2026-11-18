import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const getAllRoles = createAsyncThunk(
  "getAllRoles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/roles");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

const RoleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
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
        case getAllRoles.fulfilled.type:
          state.roles = action.payload?.data || [];
          break;
        default:
          break;
      }
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    [getAllRoles].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

export default RoleSlice.reducer
