// ============================================================================
// EL PANEL DEL EQUIPO — CATÁLOGO ÚNICO
// ============================================================================
// Las rutas del panel vivían en tres listas sin nada que las atara: las
// entradas ADMIN de `PRODUCT_ROUTES` (`product/architecture.ts`), los ítems de
// la barra lateral (`navigation/registry.ts`) y `LIVE_ROUTES` del E2E
// (`e2e/admin-routes.spec.ts`), más el enlace de soporte escrito a mano dentro
// de `AdminSidebar.tsx`. Retirar `/admin/nda` costó tocar tres archivos y dos
// tests ([F] 2026-09-17): la próxima ruta que entre o salga del panel se edita
// acá y nada más. Los tres consumidores derivan de esta lista.
//
// Son seis ([F] 2026-09-11, decisión D2 del plan 10/10): usuarios, KYC,
// analítica, auditoría y actividad salieron del panel, y lo que sobrevive de
// ellas vive dentro de las que quedan — «Hacer admin» en Accesos, la auditoría
// como pestaña de Seguridad. La cola de solicitudes por transacción salió con
// su subsistema y `/admin/nda` con el rol INVESTOR ([F] 2026-09-17).
//
// Vive fuera de `architecture.ts` por la misma razón que `public-routes.ts`:
// ese registro describe el producto entero —objetivo, CTA, gating, dueño del
// dato de cada superficie— y lo importan páginas de servidor y tests, mientras
// la barra del panel es un componente de cliente que necesita el icono.
// `architecture.ts` extiende `PRODUCT_ROUTES` con esta lista, así que el
// catálogo de producto sigue siendo uno.
// ============================================================================

import {
  Building2,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  Shield,
  UserX,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ProductRouteDefinition } from '@/lib/product/types'

// Los tres grupos de la barra, en el orden en que se pintan. Son ids: el título
// sale del diccionario (`admin.sidebar.sections.<id>`). Sin
// `Schema.Literals`: no hay frontera que decodificar —los ids salen de esta
// misma lista, no de la red ni de una URL— y el tipo se deriva del valor, así
// que no quedan dos catálogos que alguien tenga que mantener iguales.
export const ADMIN_SIDEBAR_SECTION_IDS = ['main', 'monitoring', 'settings'] as const
export type AdminSidebarSectionId = (typeof ADMIN_SIDEBAR_SECTION_IDS)[number]

/** Las filas de la barra: cada una es una llave de `admin.sidebar.items`. */
export type AdminSidebarItemKey = 'home' | 'companies' | 'support' | 'security' | 'gdpr' | 'access'

/** Cómo se pinta la ruta en la barra del panel. */
interface AdminRouteNav {
  /** Llave del rótulo de la fila en `admin.sidebar.items`. */
  labelKey: AdminSidebarItemKey
  icon: LucideIcon
  section: AdminSidebarSectionId
  /** `/admin` es prefijo de las demás: solo él marca activo por igualdad. */
  exact?: true
}

// `nav` es obligatorio y `paths` lleva una sola ruta: una página del panel sin
// fila en la barra queda invisible para el equipo —la barra es el único índice
// del panel—, y la fila necesita saber a qué ruta apunta sin elegir entre
// varias. Las dos cosas las exige el tipo, no un test.
interface AdminRouteDefinition extends ProductRouteDefinition {
  surface: 'ADMIN'
  paths: readonly [string]
  nav: AdminRouteNav
}

// El orden es el que pinta la barra: cada sección toma sus filas de acá, en
// este orden.
export const ADMIN_ROUTES: readonly AdminRouteDefinition[] = [
  {
    id: 'admin-home',
    paths: ['/admin'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Operate company preparation, VDR access, support, and security workflows.',
    primaryCta: 'Revisar operación',
    secondaryCta: 'Ver como empresa',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    analyticsEvent: 'admin_dashboard_viewed',
    entrypoints: ['/sign-in'],
    nav: { labelKey: 'home', icon: LayoutDashboard, section: 'main', exact: true },
  },
  {
    id: 'admin-companies',
    paths: ['/admin/companies'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Review company workspaces, ownership, and preparation status.',
    primaryCta: 'Revisar empresa',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    entrypoints: ['/admin'],
    nav: { labelKey: 'companies', icon: Building2, section: 'main' },
  },
  {
    id: 'admin-support',
    paths: ['/admin/support'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Answer client threads and drive the preparation queue for each room.',
    primaryCta: 'Responder hilo',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    entrypoints: ['/admin'],
    nav: { labelKey: 'support', icon: MessageSquareText, section: 'main' },
  },
  {
    id: 'admin-monitoring',
    paths: ['/admin/security'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Monitor security events and the audit trail of every admin action.',
    primaryCta: 'Revisar señal',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    entrypoints: ['/admin'],
    nav: { labelKey: 'security', icon: Shield, section: 'monitoring' },
  },
  {
    id: 'admin-gdpr',
    paths: ['/admin/gdpr'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Resolve Article 17 erasure requests before they expire unattended.',
    primaryCta: 'Revisar solicitud',
    emptyState: 'No hay solicitudes pendientes.',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    entrypoints: ['/admin'],
    nav: { labelKey: 'gdpr', icon: UserX, section: 'monitoring' },
  },
  {
    id: 'admin-workos',
    paths: ['/admin/workos'],
    surface: 'ADMIN',
    shells: ['ADMIN'],
    roles: ['ADMIN'],
    goal: 'Open the retained WorkOS administration surface.',
    primaryCta: 'Abrir administración',
    gating: ['AUTH', 'ROLE_ADMIN', 'AUDIT_LOG_REQUIRED'],
    dataOwner: 'ADMIN',
    entrypoints: ['/admin'],
    nav: { labelKey: 'access', icon: KeyRound, section: 'settings' },
  },
]
