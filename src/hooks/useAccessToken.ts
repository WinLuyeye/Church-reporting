import { useSession } from 'next-auth/react'

export const useAccessToken = () => {
  const { data: session } = useSession()
  const token = session?.user && 'accessToken' in session.user ? session.user.accessToken : null
  return token
}
