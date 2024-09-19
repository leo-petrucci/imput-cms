import React, { useContext, useEffect } from 'react'
import { useGithubToken, useGithubUser } from '../../../cms/queries/auth'
import ctxt from '../../../cms/contexts/userContext/context'
import Loader from '../../components/loader'
import { useNavigate } from 'react-router-dom'
import { useCMS } from '../cmsContext/useCMSContext'

export const useUser = () => {
  const user = useContext(ctxt)

  return user
}

const UserContextProvider = ctxt.Provider

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const tokenQuery = useGithubToken()
  const navigate = useNavigate()
  const { imput_path } = useCMS()

  const { data, isSuccess, isLoading, isError } = useGithubUser(
    tokenQuery.data!
  )

  useEffect(() => {
    if (!isLoading && (!isSuccess || isError)) {
      navigate(`${imput_path}/login`, { replace: true })
    }
  }, [isLoading, isSuccess, isError, data])

  if (tokenQuery.isLoading || isLoading) {
    return <Loader />
  }

  return <UserContextProvider value={data!}>{children}</UserContextProvider>
}
