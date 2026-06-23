// 地图数据接口客户端
// 生产环境与前端同源（nginx 把 /api 反代到后端 7999）；
// 本地 dev 由 vite.config.js 的 proxy 转发到线上。
const API_BASE = '/api'
const TOKEN_KEY = 'mapAuthToken'

let token =
  (typeof localStorage !== 'undefined' && localStorage.getItem(TOKEN_KEY)) ||
  null

export const getToken = () => token
export const hasToken = () => !!token
export const setToken = (t) => {
  token = t || null
  if (typeof localStorage === 'undefined') return
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}
export const logout = () => setToken(null)

// auth=true 的请求会带上 Bearer token; 遇到 401 自动清除本地 token
async function request(path, options = {}, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (auth && token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    if (auth) setToken(null)
    const j = await res.json().catch(() => ({}))
    throw new Error(j.message || '登录已失效，请重新登录')
  }
  if (!res.ok) throw new Error(`请求失败: ${res.status}`)
  const json = await res.json()
  if (json.code && json.code !== 200) throw new Error(json.message || '操作失败')
  return json.data
}

// 登录, 成功后保存 token
export const login = async (username, password) => {
  const data = await request('/map/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(data.token)
  return data
}

// 整图数据(公开)
export const fetchMapData = () => request('/map/data')

// 品类(需登录)
export const createCategory = (body) =>
  request('/map/categories', { method: 'POST', body: JSON.stringify(body) }, true)
export const updateCategory = (id, body) =>
  request(
    `/map/categories/${id}`,
    { method: 'PATCH', body: JSON.stringify(body) },
    true,
  )
export const deleteCategory = (id) =>
  request(`/map/categories/${id}`, { method: 'DELETE' }, true)

// 商户(需登录)
export const createShop = (body) =>
  request('/map/shops', { method: 'POST', body: JSON.stringify(body) }, true)
export const updateShop = (id, body) =>
  request(`/map/shops/${id}`, { method: 'PATCH', body: JSON.stringify(body) }, true)
export const deleteShop = (id) =>
  request(`/map/shops/${id}`, { method: 'DELETE' }, true)
