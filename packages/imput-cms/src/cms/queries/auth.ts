import { Octokit } from 'octokit'
import { useQuery, defaultContext } from '@tanstack/react-query'
import { queryKeys } from '../../cms/queries/keys'

export function getCookie(cname: string) {
  let name = cname + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return undefined
}

export const getToken = () => {
  return getCookie('imput_token') || null
}

export const useGithubUser = (token: string | null) => {
  return useQuery({
    ...queryKeys.auth.user(token!),
    context: defaultContext,
    queryFn: async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })
      const user = await octokit.request('GET /user')
      return {
        avatar_url: user.data.avatar_url,
        url: user.data.html_url,
        username: user.data.login,
        name: user.data.name,
        email: user.data.email,
      }
    },
  })
}

export const useGithubToken = () => {
  return useQuery({
    ...queryKeys.auth.token,
    context: defaultContext,
    queryFn: async () => {
      return getToken()
    },
  })
}
