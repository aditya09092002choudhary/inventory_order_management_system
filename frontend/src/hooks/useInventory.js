import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../services/api'

export function useInventory() {
  const [dashboard, setDashboard] = useState(null)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const toastTimer = useRef(null)

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  const notifySuccess = useCallback((message) => {
    setError('')
    setSuccess(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setSuccess(''), 3000)
  }, [])

  const notifyError = useCallback((message) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setSuccess('')
    setError(message)
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [dash, productList, customerList, orderList] = await Promise.all([
        api.getDashboard(),
        api.getProducts(),
        api.getCustomers(),
        api.getOrders()
      ])
      setDashboard(dash)
      setProducts(productList)
      setCustomers(customerList)
      setOrders(orderList)
      return true
    } catch (err) {
      notifyError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [notifyError])

  useEffect(() => {
    loadAll()
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [loadAll])

  const refresh = useCallback(async (message) => {
    const ok = await loadAll()
    if (ok && message) notifySuccess(message)
  }, [loadAll, notifySuccess])

  const createProduct = useCallback(async (payload) => {
    clearMessages()
    try {
      await api.createProduct(payload)
      await refresh('Product created successfully')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const updateProduct = useCallback(async (id, payload) => {
    clearMessages()
    try {
      await api.updateProduct(id, payload)
      await refresh('Product updated successfully')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const deleteProduct = useCallback(async (id) => {
    clearMessages()
    try {
      await api.deleteProduct(id)
      await refresh('Product deleted successfully')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const createCustomer = useCallback(async (payload) => {
    clearMessages()
    try {
      await api.createCustomer(payload)
      await refresh('Customer created successfully')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const deleteCustomer = useCallback(async (id) => {
    clearMessages()
    try {
      await api.deleteCustomer(id)
      await refresh('Customer deleted successfully')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const createOrder = useCallback(async (payload) => {
    clearMessages()
    try {
      await api.createOrder(payload)
      setOrderDetail(null)
      await refresh('Order placed and stock updated')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const deleteOrder = useCallback(async (id) => {
    clearMessages()
    try {
      await api.deleteOrder(id)
      setOrderDetail(null)
      await refresh('Order cancelled and stock restored')
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError, refresh])

  const loadOrderDetail = useCallback(async (id) => {
    clearMessages()
    try {
      const detail = await api.getOrder(id)
      setOrderDetail(detail)
    } catch (err) {
      notifyError(err.message)
    }
  }, [clearMessages, notifyError])

  return useMemo(() => ({
    dashboard,
    products,
    customers,
    orders,
    orderDetail,
    loading,
    error,
    success,
    clearMessages,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
    createCustomer,
    deleteCustomer,
    createOrder,
    deleteOrder,
    loadOrderDetail,
  }), [
    dashboard,
    products,
    customers,
    orders,
    orderDetail,
    loading,
    error,
    success,
    clearMessages,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
    createCustomer,
    deleteCustomer,
    createOrder,
    deleteOrder,
    loadOrderDetail,
  ])
}
