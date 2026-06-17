import { useMemo, useState } from 'react'
import SectionCard from '../components/SectionCard'
import EmptyState from '../components/EmptyState'
import { Field } from '../components/Field'

const blankCustomer = { full_name: '', email: '', phone_number: '' }

export default function CustomersPage({ customers, onCreateCustomer, onDeleteCustomer }) {
  const [form, setForm] = useState(blankCustomer)
  const [search, setSearch] = useState('')

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return customers
    return customers.filter((customer) =>
      [customer.full_name, customer.email, customer.phone_number].some((field) =>
        String(field).toLowerCase().includes(term)
      )
    )
  }, [customers, search])

  const submit = async (event) => {
    event.preventDefault()
    await onCreateCustomer({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
    })
    setForm(blankCustomer)
  }

  return (
    <div className="page-stack">
      <SectionCard title="Add customer" subtitle="Unique email validation is enforced by the backend.">
        <form className="form-grid" onSubmit={submit}>
          <Field label="Full name">
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Aditya Choudhary"
              required
            />
          </Field>

          <Field label="Email address">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="aditya@example.com"
              required
            />
          </Field>

          <Field label="Phone number">
            <input
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="+91 98765 43210"
              required
            />
          </Field>

          <div className="form-actions full-span">
            <button className="btn btn-primary" type="submit">
              Create customer
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Customer directory"
        subtitle="Search and remove customers."
        actions={
          <input
            className="search-input"
            placeholder="Search customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      >
        {filteredCustomers.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.full_name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone_number}</td>
                    <td>
                      <button className="btn btn-danger" type="button" onClick={() => onDeleteCustomer(customer.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No customers found" description="Add a customer or try a different search term." />
        )}
      </SectionCard>
    </div>
  )
}
