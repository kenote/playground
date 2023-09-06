import querystring from 'query-string'

export function useURLParams (url?: string) {
  if (url) {
    let { query } = querystring.parseUrl(url)
    return query
  }
  let { search } = useRequestURL()
  return querystring.parse(search)
}