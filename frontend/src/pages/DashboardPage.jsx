import StatCard from '../components/StatCard'
import SectionCard from '../components/SectionCard'
import EmptyState from '../components/EmptyState'

export default function DashboardPage({ dashboard, loading }) {
  if (loading && !dashboard) {
    return <div className="loading-panel">Loading dashboard...</div>
  }

  if (!dashboard) {
    return <EmptyState title="No dashboard data" description="The backend has not returned summary data yet." />
  }

  const lowStock = dashboard.low_stock_products || []

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <StatCard label="Total products" value={dashboard.total_products} helper="catalog" />
        <StatCard label="Total customers" value={dashboard.total_customers} helper="directory" />
        <StatCard label="Total orders" value={dashboard.total_orders} helper="transactions" />
        <StatCard label="Low stock products" value={lowStock.length} helper="needs attention" tone={lowStock.length ? 'warn' : 'good'} />
      </div>

      <SectionCard
        title="Low stock products"
        subtitle="Products at or below the configured threshold are highlighted here."
      >
        {lowStock.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.sku}</td>
                    <td>
                      <span className={product.quantity <= 2 ? 'danger-pill' : 'warning-pill'}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>${Number(product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Inventory looks healthy"
            description="No products are currently below the low stock threshold."
          />
        )}
      </SectionCard>
    </div>
  )
}
