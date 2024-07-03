import { Session } from './storage'

interface FetchRequestConfig extends RequestInit {
  url: string
}
/**
 * fetch API 封装
 */
const request = ({ url, ...args }: FetchRequestConfig) => {
  return fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...args,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Session.getACToken()}`,
    },
  })
}

export default request
