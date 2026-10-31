
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

        <Route path='/admin' element = {<Sales/>}/>


      </Routes>

      
    
    </>
  )
}

export default AppRoutes
