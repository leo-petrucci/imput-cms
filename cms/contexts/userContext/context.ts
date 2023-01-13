import React from 'react'
import { Endpoints } from '@octokit/types'

export interface UserContext {
  avatar_url: Endpoints['GET /user']['response']['data']['avatar_url']
  url: Endpoints['GET /user']['response']['data']['html_url']
  username: Endpoints['GET /user']['response']['data']['login']
  email: Endpoints['GET /user']['response']['data']['email']
  name: Endpoints['GET /user']['response']['data']['name']
}

const ctxt = React.createContext({} as UserContext)

export default ctxt
