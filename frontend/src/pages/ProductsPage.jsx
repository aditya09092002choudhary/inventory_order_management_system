import { useMemo, useState } from 'react'
import SectionCard from '../components/SectionCard'
import EmptyState from '../components/EmptyState'
import { Field } from '../components/Field'

const blankProduct = { name: '', sku: '', price: '', quantity: '' }

export default function ProductsPage({ products, onCreateProduct, onUpdateProduct, onDeleteProduct }) {
  const [form, setForm] = useState(blankProduct)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      [product.name, product.sku].some((field) => String(field).toLowerCase().includes(term))
    )
  }, [products, search])

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity: String(product.quantity),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(blankProduct)
  }

  const submit = async (event) => {
    event.preventDefault()
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    if (editingId) {
      await onUpdateProduct(editingId, payload)
    } else {
      await onCreateProduct(payload)
    }

    cancelEdit()
  }

  return (
    <div className="page-stack">
      <SectionCard
        title={editingId ? 'Update product' : 'Add product'}
        subtitle="Maintain SKU uniqueness, quantity, and pricing from one form."
      >
        <form className="form-grid" onSubmit={submit}>
          <Field label="Product name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Wireless Mouse"
              required
            />
          </Field>

          <Field label="SKU / code">
            <input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="WM-001"
              required
            />
          </Field>

          <Field label="Price">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="199.99"
              required
            />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="25"
              required
            />
          </Field>

          <div className="form-actions full-span">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Update product' : 'Create product'}
            </button>
            {editingId ? (
              <button className="btn" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Product catalog"
        subtitle="Search, edit, and delete products."
        actions={
          <input
            className="search-input"
            placeholder="Search product or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      >
        {filteredProducts.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.sku}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <span className={product.quantity <= 2 ? 'danger-pill' : product.quantity <= 5 ? 'warning-pill' : 'success-pill'}>
                        {product.quantity <= 2 ? 'Critical' : product.quantity <= 5 ? 'Low' : 'Healthy'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-soft" type="button" onClick={() => startEdit(product)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => onDeleteProduct(product.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No products found" description="Try another search term or add your first product." />
        )}
      </SectionCard>
    </div>
  )
}
