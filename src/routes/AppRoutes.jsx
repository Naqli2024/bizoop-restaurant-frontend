
import React from 'react'
import Header from '../components/Header/Header'
import { Navigate, Route, Routes } from 'react-router-dom'

import RestaurantMain from '../pages/Dashboard/RestaurantMain'

import SalesIq from '../pages/Cashier/SalesIq/SalesIq'
import Billing from '../pages/Cashier/Billing/Billing'
import Returns from '../pages/Cashier/Returns/Returns'
import Bills from '../pages/Cashier/Bills/Bills'
import WhatsApp from '../pages/Cashier/Whatsapp/Whatsapp'
import DayEnd from '../pages/Cashier/DayEnd/DayEnd'
import Store from '../pages/Cashier/Store/Store'
import SelfOrder from '../pages/Cashier/SelfOrder/SelfOrder'

import Floor from '../pages/Captain/Floor/Floor'
import Order from '../pages/Captain/Order/Order'
import OrderEntry from '../pages/Captain/OrderEntry/OrderEntry'

import Display from '../pages/KOT-Display/display/Display'
import Printers from '../pages/KOT-Display/printers/Printers'
import Perf from '../pages/KOT-Display/perf/Perf'
import SOP from '../pages/KOT-Display/SOP/SOP'
import Production from '../pages/KOT-Display/production/Production'

import BackOffice from '../pages/Back-Office/BackOffice'
import Sales from '../pages/Admin/Sales'
import Command from '../pages/Admin/Command/Command'
import Kitchen from '../pages/Admin/Kitchen/Kitchen'
import SOPRecipes from '../pages/Admin/Kitchen/SOP-Recipes/SOP-Recipes'
import Operations from '../pages/Admin/Operations'
import AdminStore from '../pages/Admin/Store/AdminStore/AdminStore'
import Procurement from '../pages/Admin/Procurement/Procurement'
import People from '../pages/Admin/People/People'
import StaffAdmin from '../pages/Admin/People/StaffAdmin'
import Assets from '../pages/Admin/Assets/Assets'
import Finance from '../pages/Admin/Finance/Finance'
import Comply from '../pages/Admin/Comply/Comply'
import Intel from '../pages/Admin/Intel/Intel'
import Customers from '../pages/Admin/Customers/Customers'
import LoyaltyMarketing from '../pages/Admin/Customers/LoyaltyMarketing'
import Customer360 from '../pages/Admin/Customers/Customer360'

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Cashier Routes */}
        <Route path='/cashier' element={<RestaurantMain />}>
          <Route path='sales-iq' element={<SalesIq />} />
          <Route path='billing' element={<Billing />} />
          <Route path='returns' element={<Returns />} />
          <Route path='bills' element={<Bills />} />
          <Route path='whatsapp' element={<WhatsApp />} />
          <Route path='day-end' element={<DayEnd />} />
          <Route path='store' element={<Store />} />
          <Route path='self-order' element={<SelfOrder />} />
        </Route>
        {/* Captain Routes */}
        <Route path='/captain' element={<RestaurantMain />}>
          <Route path='floor' element={<Floor />} />
          <Route path='order' element={<Order />} />
          <Route path='orders' element={<OrderEntry />} />
        </Route>
        {/* KOT Display Routes */}
        <Route path='/kot-display' element={<RestaurantMain />}>
          <Route path='display' element={<Display />} />
          <Route path='printers' element={<Printers />} />
          <Route path='perf' element={<Perf />} />
          <Route path='sop' element={<SOP />} />
          <Route path='production' element={<Production />} />
        </Route>
        {/* Back Office Route */}
        <Route path='/back-office' element={<BackOffice />} />

        {/*Admin */}
        <Route path='/admin' element={<RestaurantMain />}>
         <Route path='command' element={<Command/>}/>
         <Route path='sales' element={<Sales/>}/>
         <Route path='operations' element={<Operations/>}/>
         <Route path='kitchen' element={<Kitchen/>}/>
         <Route path='sop-recipes' element={<SOPRecipes/>}/>
         <Route path='admin-store' element={<AdminStore/>}/>
         <Route path='procure' element={<Procurement/>}/>
         <Route path='people' element={<People/>}/>
         <Route path='customers' element={<Customers/>}/>
         <Route path='admin-staff' element={<StaffAdmin/>}/>
         <Route path='assets' element={<Assets/>}/>
         <Route path='finance' element={<Finance/>}/>
         <Route path='comply' element={<Comply/>}/>
         <Route path='intel' element={<Intel/>}/>
         <Route path='marketing' element={<LoyaltyMarketing/>}/>
             <Route path='inbox' element={<Customer360/>}/>
         </Route>
      </Routes>
    </>
  )
}

export default AppRoutes
