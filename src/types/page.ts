// =============================================================================
// Paginated list shape shared by every list endpoint in the API
// =============================================================================

export interface Page<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Query parameters every paginated endpoint accepts. page_size is at most 100.
export interface PageParams {
  page?: number
  page_size?: number
}
