const API_BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

export function clearToken() {
  localStorage.removeItem('admin_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface Customer {
  id: string
  slug: string
  address_line: string
  city: string
  alarm_panel: string
  image: string
  created_at: string
  updated_at: string
  zones?: Zone[]
}

export interface Zone {
  id: string
  customer_id: string
  zone_key: string
  description: string
  lang: string
  created_at: string
}

export interface HALight {
  id: string
  light_key: string
  entity_id: string
  name: string
  top: string
  left_pos: string
}

export interface Movie {
  id: string
  movie_key: string
  name: string
  url: string
}

export interface Song {
  id: string
  song_key: string
  name: string
  url: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export async function login(username: string, password: string): Promise<string> {
  const res = await request<{ token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(res.token)
  return res.token
}

export async function getCustomers(page = 1, search = ''): Promise<PaginatedResponse<Customer>> {
  const params = new URLSearchParams({ page: String(page), page_size: '20' })
  if (search) params.set('search', search)
  return request(`/customers?${params}`, { headers: authHeaders() })
}

export async function getCustomer(slug: string): Promise<Customer> {
  return request(`/public/customers/${slug}`)
}

export async function getAdminCustomer(slug: string): Promise<Customer> {
  return request(`/customers/${slug}`, { headers: authHeaders() })
}

export async function createCustomer(data: Partial<Customer>): Promise<void> {
  return request('/customers', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export async function updateCustomer(slug: string, data: Partial<Customer>): Promise<void> {
  return request(`/customers/${slug}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export async function deleteCustomer(slug: string): Promise<void> {
  return request(`/customers/${slug}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function createZone(slug: string, zone: Partial<Zone>): Promise<void> {
  return request(`/customers/${slug}/zones`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(zone),
  })
}

export async function deleteZone(slug: string, zoneKey: string): Promise<void> {
  return request(`/customers/${slug}/zones/${zoneKey}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function getPublicCustomers(): Promise<Customer[]> {
  return request('/public/customers')
}

export async function getLights(): Promise<HALight[]> {
  return request('/public/lights')
}

export async function getMovies(): Promise<Movie[]> {
  return request('/public/movies')
}

export async function getSongs(): Promise<Song[]> {
  return request('/public/songs')
}
