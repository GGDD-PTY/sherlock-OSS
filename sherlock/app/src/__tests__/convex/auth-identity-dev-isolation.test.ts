import { afterEach, describe, expect, it, vi } from 'vitest'

import { requireAuth } from '../../../convex/_helpers/auth.identity'
import { ensureCompanyWorkspace, getMyVdrWorkspace } from '../../../convex/companies'
import { createConvexCtx, runHandler, type Tables } from './nda-convex-harness'

afterEach(() => vi.unstubAllEnvs())

describe('explicit identities remain isolated from the development fallback', () => {
  function fixture() {
    vi.stubEnv('BYPASS_AUTH', 'true')
    vi.stubEnv('CONVEX_ENV', 'dev')
    const tables: Tables = {
      users: [
        {
          _id: 'user_admin',
          email: 'admin@dev.local',
          clerkId: 'dev_admin_001',
          role: 'ADMIN',
        },
        {
          _id: 'user_new',
          authProvider: 'workos',
          providerUserId: 'workos_new',
          workosUserId: 'workos_new',
          email: 'new@dev.local',
          role: 'COMPANY',
        },
      ],
      profiles: [{ _id: 'profile_admin', userId: 'user_admin', role: 'ADMIN', isActive: true }],
    }
    return tables
  }

  it('rejects an unknown explicit identity instead of returning the development admin', async () => {
    const ctx = createConvexCtx(fixture(), {
      identity: { subject: 'workos_unknown', issuer: 'https://api.workos.com/' },
    })
    await expect(requireAuth(ctx as never)).rejects.toMatchObject({
      data: { code: 'USER_NOT_FOUND' },
    })
  })

  it('rejects a missing profile instead of returning the development admin', async () => {
    const ctx = createConvexCtx(fixture(), {
      identity: { subject: 'workos_new', issuer: 'https://api.workos.com/' },
    })
    await expect(requireAuth(ctx as never)).rejects.toMatchObject({
      data: { code: 'PROFILE_NOT_FOUND' },
    })
  })

  it('preserves the explicit development fallback when there is no identity', async () => {
    const ctx = createConvexCtx(fixture())
    await expect(requireAuth(ctx as never)).resolves.toMatchObject({
      profile: { _id: 'profile_admin', role: 'ADMIN' },
    })
  })

  it.each([
    ['dev', 'workos_unknown'],
    ['dev', 'workos_new'],
    ['prod', 'workos_unknown'],
    ['prod', 'workos_new'],
  ])(
    'provisions in %s as %s without borrowing the development admin identity',
    async (env, subject) => {
      const tables = fixture()
      vi.stubEnv('CONVEX_ENV', env)
      const ctx = createConvexCtx(tables, {
        identity: {
          subject,
          issuer: 'https://api.workos.com/',
          email: subject === 'workos_new' ? 'new@dev.local' : 'unknown@dev.local',
        },
      })

      await expect(runHandler(getMyVdrWorkspace, ctx, {})).resolves.toBeNull()
      await expect(runHandler(ensureCompanyWorkspace, ctx, {})).resolves.toMatchObject({
        role: 'COMPANY',
        created: true,
        company: { ownerId: expect.not.stringMatching(/^profile_admin$/) },
      })
      const user = tables.users.find((row) => row.workosUserId === subject)!
      const profile = tables.profiles.find((row) => row.userId === user._id)!
      await expect(runHandler(getMyVdrWorkspace, ctx, {})).resolves.toMatchObject({
        access: 'MANAGE',
        company: { ownerId: profile._id },
      })
      expect(tables.companies).toHaveLength(1)
      expect(tables.documents ?? []).toHaveLength(0)
    }
  )

  it('keeps an inactive profile denied instead of treating it as a first access', async () => {
    const tables = fixture()
    tables.profiles.push({
      _id: 'profile_new',
      userId: 'user_new',
      role: 'COMPANY',
      isActive: false,
    })
    const ctx = createConvexCtx(tables, {
      identity: { subject: 'workos_new', issuer: 'https://api.workos.com/' },
    })
    for (const handler of [getMyVdrWorkspace, ensureCompanyWorkspace]) {
      await expect(runHandler(handler, ctx, {})).rejects.toMatchObject({
        data: { code: 'AUTHZ_UNAUTHORIZED' },
      })
    }
    expect(tables.companies ?? []).toHaveLength(0)
  })
})
