import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const getAllCategories = createAsyncThunk(
  "getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/menu-categories");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)

export const getAllFoodItems= createAsyncThunk(
  "getAllFoodItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/food-menu");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
)


export const getFoodItemByCategory = createAsyncThunk(
  "getFoodItemByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/food-menu", {
        params: {
          categoryId,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getSearchFoodItems = createAsyncThunk(
  "getSearchFoodItems",
  async (search, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/food-menu", {
        params: {
          search,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getFilterByOrderType = createAsyncThunk(
  "getFilterByOrderType",
  async (orderType, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/food-menu", {
        params: {
          orderType,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addCategory = createAsyncThunk(
  "addCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(`/menu-categories`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editCategory = createAsyncThunk(
  "editCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await AuthService.put(`/menu-categories/${id}`,data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addFoodItem = createAsyncThunk(
  "addFoodItem",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post(`/food-menu`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editFoodItem = createAsyncThunk(
  "editFoodItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await AuthService.put( `/food-menu/${id}`,data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const MenuSlice = createSlice({
  name: "menus",
  initialState: {
    menus: [],
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
    case getAllCategories.fulfilled.type:
      state.menus = action.payload?.data || [];
      break;

    case getAllFoodItems.fulfilled.type:
      state.menus = action.payload?.data || [];
      break;

    case getFoodItemByCategory.fulfilled.type:
      state.menus = action.payload?.data || [];
      break;

    case getFilterByOrderType.fulfilled.type:
      state.menus = action.payload?.data || [];
      break;
    
    case getSearchFoodItems.fulfilled.type:
      state.menus = action.payload?.data || [];
      break;
    

    case addCategory.fulfilled.type:
      state.menus.push(action.payload?.data);
      break;

    case editCategory.fulfilled.type:
      state.menus = state.menus.map((menu) =>
        menu._id === action.meta.arg.id
          ? action.payload?.data
          : menu
      );
      break;
      case addFoodItem.fulfilled.type:
      state.menus.push(action.payload?.data);
      break;

    case editFoodItem.fulfilled.type:
      state.menus = state.menus.map((menu) =>
        menu._id === action.meta.arg.id
          ? action.payload?.data
          : menu
      );
      break;
    default:
      break;
  }
};

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    [getAllCategories,getAllFoodItems,getFilterByOrderType,getFoodItemByCategory,getSearchFoodItems,addCategory,addFoodItem,editCategory,editFoodItem].forEach((action) => {
      builder
        .addCase(action.pending, handlePending)
        .addCase(action.fulfilled, handleFulFilled)
        .addCase(action.rejected, handleRejected);
    });
  },
});

export default MenuSlice.reducer
