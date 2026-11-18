import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../redux/Auth/AuthSlice";
import StaffReducer from "../redux/Staffs/StaffSlice"
import RolesReducer from "../redux/Roles/RoleSlice"
import FloorsReducer from "../redux/Floors/FloorSlice"
import KitchensReducer from "../redux/Kitchen/KotSlice"
import OrderReducer from "../redux/Order/OrderSlice"
import MenuReducer from "../redux/FoodMenus/MenuSlice"
import KotReducer from "../redux/Kitchen/KitchenSlice"
import BillReducer from "../redux/Bills/BillSlice"

const rootReducer=combineReducers({
    authAdmin:AuthReducer,
    employee:StaffReducer,
    roles:RolesReducer,
    floors:FloorsReducer,
    stations:KitchensReducer,
    order:OrderReducer,
    menus:MenuReducer,
    kitchen:KotReducer,
    bills:BillReducer

})

const store = configureStore({
  reducer: rootReducer,
});

export default store;