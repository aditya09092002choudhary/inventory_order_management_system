import { useState } from 'react'
import AlertBanner from './components/AlertBanner'
import AppShell from './components/AppShell'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import OrdersPage from './pages/OrdersPage'
import { useInventory } from './hooks/useInventory'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

  const inventory = useInventory()

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} apiBaseUrl={apiBaseUrl}>
      <div className="content-stack">
        <AlertBanner type="error" message={inventory.error} onClose={inventory.clearMessages} />
        <AlertBanner type="success" message={inventory.success} onClose={inventory.clearMessages} />

        {inventory.loading ? <div className="loading-panel">Syncing with backend...</div> : null}

        {activeTab === 'dashboard' ? (
          <DashboardPage dashboard={inventory.dashboard} loading={inventory.loading} />
        ) : null}

        {activeTab === 'products' ? (
          <ProductsPage
            products={inventory.products}
            onCreateProduct={inventory.createProduct}
            onUpdateProduct={inventory.updateProduct}
            onDeleteProduct={inventory.deleteProduct}
          />
        ) : null}

        {activeTab === 'customers' ? (
          <CustomersPage
            customers={inventory.customers}
            onCreateCustomer={inventory.createCustomer}
            onDeleteCustomer={inventory.deleteCustomer}
          />
        ) : null}

        {activeTab === 'orders' ? (
          <OrdersPage
            orders={inventory.orders}
            customers={inventory.customers}
            products={inventory.products}
            orderDetail={inventory.orderDetail}
            onCreateOrder={inventory.createOrder}
            onDeleteOrder={inventory.deleteOrder}
            onViewOrder={inventory.loadOrderDetail}
          />
        ) : null}
      </div>
    </AppShell>
  )
}
