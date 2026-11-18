import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const getFloorsTables = createAsyncThunk(
  "getFloorsTables",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/orders/dine-in/floors");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const getFloors = createAsyncThunk(
  "getFloors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/floors");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const addFloor = createAsyncThunk(
  "addFloor",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(`/floors`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editFloor = createAsyncThunk(
  "editFloor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await AuthService.put(`/floors/${id}`,data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addTable = createAsyncThunk(
  "addTable",
  async ({floorId,payload}, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(`/floors/${floorId}/tables`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editTable = createAsyncThunk(
  "editTable",
  async ({ floorId, tableId, data }, { rejectWithValue }) => {
    try {
      const response = await AuthService.put( `/floors/${floorId}/tables/${tableId}`,data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const FloorSlice = createSlice({
  name: "floors",
  initialState: {
    floors: [],
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
    case getFloorsTables.fulfilled.type:
      state.floors = action.payload?.data || [];
      break;

    case getFloors.fulfilled.type:
      state.floors = action.payload?.data || [];
      break;

    case addFloor.fulfilled.type:
      state.floors.push(action.payload?.data);
      break;

    case editFloor.fulfilled.type:
      state.floors = state.floors.map((floor) =>
        floor._id === action.meta.arg.id
          ? action.payload?.data
          : floor
      );
      break;

    case addTable.fulfilled.type:
      // Refresh floors and tables using getFloorsTables
      break;

    case editTable.fulfilled.type:
      // Refresh floors and tables using getFloorsTables
      break;

    default:
      break;
  }
};

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    [getFloorsTables,getFloors,addFloor,editFloor,addTable,editTable].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

export default FloorSlice.reducer
