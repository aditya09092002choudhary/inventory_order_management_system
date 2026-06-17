import { useEffect, useMemo, useState } from 'react'
import SectionCard from '../components/SectionCard'
import EmptyState from '../components/EmptyState'
import { Field } from '../components/Field'

const blankLineItem = { product_id: '', quantity: 1 }

export default function OrdersPage({
  orders,
  customers,
  products,
  orderDetail,
  onCreateOrder,
  onDeleteOrder,
  onViewOrder,
}) {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([blankLineItem])
  console.log(orderDetail)
  useEffect(() => {
    if (!customerId && customers.length) {
      setCustomerId(String(customers[0].id))
    }
  }, [customerId, customers])

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    )
  }

  const addItem = () => setItems((current) => [...current, blankLineItem])
  const removeItem = (index) =>
    setItems((current) => {
      const next = current.filter((_, idx) => idx !== index)
      return next.length ? next : [blankLineItem]
    })

  const selectedProducts = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((entry) => String(entry.id) === String(item.product_id))
        if (!product) return null
        const qty = Number(item.quantity || 0)
        return { product, qty, lineTotal: Number(product.price) * qty }
      })
      .filter(Boolean)
  }, [items, products])

  const estimatedTotal = selectedProducts.reduce((sum, item) => sum + item.lineTotal, 0)

  const submit = async (event) => {
    event.preventDefault()
    await onCreateOrder({
      customer_id: Number(customerId),
      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    })
    setItems([blankLineItem])
  }

  return (
    <div className="page-stack">
      <SectionCard
        title="Create order"
        subtitle="The backend checks stock and automatically reduces inventory."
      >
        <form className="form-stack" onSubmit={submit}>
          <div className="two-column">
            <Field label="Customer">
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estimated total">
              <div className="estimate-box">${estimatedTotal.toFixed(2)}</div>
            </Field>
          </div>

          {items.map((item, index) => (
            <div className="order-row" key={index}>
              <Field label={`Product ${index + 1}`}>
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} | Stock {product.quantity}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  required
                />
              </Field>

              <div className="line-actions">
                <button className="btn btn-soft" type="button" onClick={() => removeItem(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button className="btn btn-soft" type="button" onClick={addItem}>
              Add another product
            </button>
            <button className="btn btn-primary" type="submit">
              Place order
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Orders" subtitle="View order history and cancel orders when needed.">
        {orders.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || `Customer ${order.customer_id}`}</td>
                    <td>${Number(order.total_amount).toFixed(2)}</td>
                    <td>{order.items.length}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-soft" type="button" onClick={() => onViewOrder(order.id)}>
                          View
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => onDeleteOrder(order.id)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No orders yet" description="Create your first order from the form above." />
        )}
      </SectionCard>

      {orderDetail ? (
        <SectionCard
          title={`Order details #${orderDetail.id}`}
          subtitle={`Customer: ${orderDetail.customer_name || `Customer ${orderDetail.customer_id}`}`}
        >
          <div className="detail-grid">
            <div className="detail-card">
              <span className="detail-label">Total amount</span>
              <strong>${Number(orderDetail.total_amount).toFixed(2)}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-label">Line items</span>
              <strong>{orderDetail.items.length}</strong>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name || item.product_id}</td>
                    <td>{item.sku || '-'}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.unit_price).toFixed(2)}</td>
                    <td>${Number(item.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </div>
  )
}
