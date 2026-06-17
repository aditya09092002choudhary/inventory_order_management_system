const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'products', label: 'Products' },
  { key: 'customers', label: 'Customers' },
  { key: 'orders', label: 'Orders' }
]

export default function AppShell({ activeTab, onTabChange, children, apiBaseUrl }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">IM</div>
          <div>
            <p className="eyebrow">Inventory Management</p>
            <h1>Order Ops</h1>
          </div>
        </div>

        <p className="sidebar-copy">
          Manage products, customers, and orders from one clean dashboard.
        </p>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeTab === item.key ? 'nav-item active' : 'nav-item'}
              onClick={() => onTabChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <span className="chip">API</span>
          <code>{apiBaseUrl}</code>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Production-ready assessment app</p>
            <h2>Inventory & Order Management System</h2>
            <p className="muted">
              Modular React UI connected to a FastAPI backend and PostgreSQL.
            </p>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
