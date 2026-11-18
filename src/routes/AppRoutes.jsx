import React from 'react'
import Header from '../components/Header/Header'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import RestaurantMain from '../pages/Dashboard/RestaurantMain'
import SalesIq from '../pages/Cashier/SalesIq/SalesIq'
import Billing from '../pages/Cashier/Billing/Billing'
import Floor from '../pages/Captain/Floor/Floor'
import Order from '../pages/Captain/Order/Order'
import OrderEntry from '../pages/Captain/OrderEntry/OrderEntry'
import Display from '../pages/KOT-Display/display/Display'
import Printers from '../pages/KOT-Display/printers/Printers'
import Perf from '../pages/KOT-Display/perf/Perf'
import SOP from '../pages/KOT-Display/SOP/SOP'
import Production from '../pages/KOT-Display/production/Production'
import Overview from '../pages/Back-Office/Overview/Overview'
import Purchase from '../pages/Back-Office/purchase/Purchase'
import Inventory from '../pages/Back-Office/inventory/Inventory'
import Sales from '../pages/Owner/sales/Sales'
import Command from '../pages/Owner/command/Command'
import Operations from '../pages/Owner/operations/Operations'
import Kitchen from '../pages/Owner/kitchen/Kitchen'
import SOPRecipes from '../pages/Owner/kitchen/SOP-Recipes/SOPRecipes'
import Store from '../pages/Owner/Store/Store'
import Stock from '../pages/Owner/Store/Stock/Stock'
import WasteControl from '../pages/Owner/Store/wastage&ctrl/WastageControl'
import Procurement from '../pages/Owner/procurement/Procurement'
import People from '../pages/Owner/people/People'
import StaffAdmin from '../pages/Owner/people/staff-admin/StaffAdmin'
import Finance from '../pages/Owner/Finance/Finance'
import Assets from '../pages/Owner/assets/Assets'
import Comply from '../pages/Owner/comply/Comply'
import Intel from '../pages/Owner/intel/Intel'
import IntellDashboard from '../pages/Owner/intel/intell-dashboard/IntellDashboard'
import Customers from '../pages/Owner/customers/Customers'
import CRM from '../pages/Owner/customers/crm/CRM'
import LoyaltyMarketing from '../pages/Owner/customers/marketing/LoyaltyMarketing'
import Customer360 from '../pages/Owner/customers/customer360/Customer360'
import Recon from '../pages/Back-Office/recon/Recon'
import Expenses from '../pages/Back-Office/expenses/Expenses'
import SiteHeader from '../components/Header/SiteHeader'
import LandingPage from '../pages/BOS/LandingPage/LandingPage'
import LoginPage from '../pages/Auth/LoginPage'
import StaffPay from '../pages/Owner/staffpay/StaffPay'
import Vouchers from '../pages/Back-Office/vouchers/Vouchers'
import ProfitLoss from '../pages/Back-Office/profitloss/ProfitLoss'
import Compliance from '../pages/Back-Office/compliance/Compliance'
import MenuQR from '../pages/Back-Office/menu/MenuQR'
import ScreenPlayer from '../pages/Back-Office/menu/ScreenPlayer'
import Returns from '../pages/Cashier/Returns/Returns'
import Bills from '../pages/Cashier/Bills/Bills'
import WhatsApp from '../pages/Cashier/Whatsapp/Whatsapp'
import DayEnd from '../pages/Cashier/DayEnd/DayEnd'
import SelfOrder from '../pages/Cashier/SelfOrder/SelfOrder'
import StoreCashier from '../pages/Cashier/Store/StoreCashier'
import IOT from '../pages/Back-Office/iot/IOT'
import Settings from '../pages/Back-Office/settings/Settings'



const AppRoutes = () => {
  const location=useLocation()
  const isLandingPage = location.pathname === '/'

  // Application paths
  const isApplicationPage = [
    '/cashier',
    '/captain',
    '/kot-display',
    '/back-office',
    '/admin'
  ].some(path => location.pathname.startsWith(path))

  return (
    <>
    
      {isLandingPage && <SiteHeader />}

      {isApplicationPage && <Header />}
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='login' element={<LoginPage/>}/>

        <Route path='/cashier' element={<RestaurantMain />}>
          <Route path='sales-iq' element={<SalesIq />} />
          <Route path='billing' element={<Billing />} />
           <Route path='returns' element={<Returns />} />
          <Route path='bills' element={<Bills />} />
          <Route path='whatsapp' element={<WhatsApp />} />
          <Route path='day-end' element={<DayEnd />} />
          <Route path='store' element={<StoreCashier />} />
          <Route path='self-order' element={<SelfOrder />} />
        </Route>
        <Route path='/captain' element={<RestaurantMain />}>
          <Route path='floor' element={<Floor />} />
          <Route path='order' element={<Order />} />
          <Route path='orders' element={<OrderEntry />} />
        </Route>
        <Route path='/kot-display' element={<RestaurantMain />}>
          <Route path='display' element={<Display />} />
          <Route path='printers' element={<Printers />} />
          <Route path='perf' element={<Perf />} />
          <Route path='sop' element={<SOP />} />
          <Route path='production' element={<Production/>}/>
        </Route>
        <Route path='/back-office' element={<RestaurantMain />}>
          <Route path='overview' element={<Overview />} />
          <Route path='purchase' element={<Purchase/>}/>
          <Route path='inventory' element={<Inventory/>}/>
          <Route path='recon' element={<Recon/>}/>
          <Route path='expenses' element={<Expenses/>}/>
          <Route path='vouchers' element={<Vouchers/>}/>
          <Route path='p&l'element={<ProfitLoss/>}/>
          <Route path='compliance' element={<Compliance/>}/>
          <Route path='menu'element={<MenuQR/>}/>
          <Route path='screen-player' element={<ScreenPlayer/>}/>
          <Route path='IoT' element={<IOT/>}/>
          <Route path='settings' element={<Settings/>}/>
        </Route>
         <Route path='/admin' element={<RestaurantMain />}>
         <Route path='command' element={<Command/>}/>
         <Route path='sales' element={<Sales/>}/>
         <Route path='operations' element={<Operations/>}/>
          <Route path='kitchen' element={<Kitchen/>}/>
          <Route path='sop-recipes' element={<SOPRecipes/>}/>
          <Route path='store' element={<Store/>}/>
          <Route path='stock' element={<Stock/>}/>
           <Route path='ctl' element={<WasteControl/>}/>
           <Route path='procure' element={<Procurement/>}/>
           <Route path='people' element={<People/>}/>
          <Route path='finance' element={<Finance/>}/>
           <Route path='assets' element={<Assets/>}/>
           <Route path='comply' element={<Comply/>}/>
           <Route path='intel' element={<Intel/>}/>
            <Route path='intel-dash' element={<IntellDashboard/>}/>
            <Route path='customers' element={<Customers/>}/>
             <Route path='crm' element={<CRM/>}/>
             <Route path='marketing' element={<LoyaltyMarketing/>}/>
             <Route path='inbox' element={<Customer360/>}/>
            <Route path='staff' element={<StaffPay/>}/>
         </Route>
      </Routes>
    </>
  )
}

export default AppRoutes
