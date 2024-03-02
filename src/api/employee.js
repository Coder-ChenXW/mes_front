import request from '@/utils/request'

const ac_base = '/ac/authentication'
const employee_base = '/base/employee'

export default {
  login(data) {
    return request({
      url: `${ac_base}/login`,
      method: 'post',
      data
    })
  },
  getInfo(token) {
    return request({
      url: `${ac_base}/info`,
      method: 'get',
      params: { token }
    })
  },
  logout() {
    return request({
      url: `${ac_base}/logout`,
      method: 'post'
    })
  },
  updatePwd(data) {
    return request({
      url: `${ac_base}/updatePassword`,
      method: 'post',
      data
    })
  },
  inactiveEmployee(id) {
    return request({
      url: `${employee_base}/${id}:leaveTheJob`,
      method: 'patch'
    })
  },
  activeEmployee(id) {
    return request({
      url: `${employee_base}/${id}:onTheJob`,
      method: 'patch'
    })
  },
  createEmployee(data) {
    return request({
      url: `${employee_base}`,
      method: 'post',
      data
    })
  },
  deleteEmployee(id) {
    return request({
      url: `${employee_base}/${id}`,
      method: 'delete'
    })
  },
  updateEmployee(id, data) {
    return request({
      url: `${employee_base}/${id}`,
      method: 'put',
      data
    })
  },
  getById(id) {
    return request({
      url: `${employee_base}/${id}`,
      method: 'get'
    })
  },
  getActivatedEmployees() {
    return request({
      url: `${employee_base}/activated`,
      method: 'get'
    })
  },
  employeePage(params) {
    return request({
      url: `${employee_base}/page`,
      method: 'get',
      params
    })
  }
}
