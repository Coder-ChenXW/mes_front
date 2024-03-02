import request from '@/utils/request'

const supplier_base = '/base/supplier'

export default {
  getSuppliers(params) {
    return request({
      url: `${supplier_base}/page`,
      method: 'get',
      params
    })
  },
  createSupplier(data) {
    return request({
      url: `${supplier_base}`,
      method: 'post',
      data
    })
  },
  updateSupplier(id, data) {
    return request({
      url: `${supplier_base}/${id}`,
      method: 'put',
      data
    })
  },
  deleteSupplier(id) {
    return request({
      url: `${supplier_base}/${id}`,
      method: 'delete'
    })
  },
  getSupplierById(id) {
    return request({
      url: `${supplier_base}/${id}`,
      method: 'get'
    })
  }
}
