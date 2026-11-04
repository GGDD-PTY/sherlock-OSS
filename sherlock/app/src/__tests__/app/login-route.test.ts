import { getSignInUrl } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/login/route'

const authorizationUrl =
  'https://auth.workos.test/authorize?client_id=client_fixture&state=sealed%2Bstate%2F%3D&code_challenge=challenge_fixture&code_challenge_method=S256'

describe('login route', () => {
  beforeEach(() => {
    vi.mocked(getSignInUrl).mockReset().mockResolvedValue(authorizationUrl)
    vi.mocked(redirect).mockReset()
  })

  it('requires fresh authentication when the admin verification action requests it', async () => {
    await GET(new NextRequest('http://localhost:3000/login?returnTo=%2Fes%2Fadmin&stepUp=1'))

    expect(getSignInUrl).toHaveBeenCalledWith({ returnTo: '/es/admin' })
    const destination = new URL(String(vi.mocked(redirect).mock.calls[0]?.[0]))
    expect(destination.searchParams.get('prompt')).toBe('login')
    expect(destination.searchParams.get('max_age')).toBe('0')
    expect(destination.origin).toBe('https://auth.workos.test')
    expect(destination.searchParams.get('client_id')).toBe('client_fixture')
    expect(destination.searchParams.get('state')).toBe('sealed+state/=')
    expect(destination.searchParams.get('code_challenge')).toBe('challenge_fixture')
    expect(destination.searchParams.get('code_challenge_method')).toBe('S256')
  })

  it('preserves normal login without forcing authentication again', async () => {
    await GET(new NextRequest('http://localhost:3000/login?returnTo=%2Fes%2Fonboarding'))

    expect(getSignInUrl).toHaveBeenCalledWith({ returnTo: '/es/onboarding' })
    expect(redirect).toHaveBeenCalledWith(authorizationUrl)
  })

  it('keeps the document handoff inside the safe return destination', async () => {
    const returnTo = '/es/my-company/documents?handoff=7c9e6679-7425-40de-944b-e07fc1f90ae7'
    await GET(
      new NextRequest(`http://localhost:3000/login?returnTo=${encodeURIComponent(returnTo)}`)
    )

    expect(getSignInUrl).toHaveBeenCalledWith({ returnTo })
    expect(redirect).toHaveBeenCalledWith(authorizationUrl)
  })

  it('rejects an external return destination during additional verification', async () => {
    await GET(
      new NextRequest('http://localhost:3000/login?returnTo=https%3A%2F%2Fevil.example&stepUp=1')
    )

    expect(getSignInUrl).toHaveBeenCalledWith({ returnTo: '/es/onboarding' })
  })
})
