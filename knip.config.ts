import type { KnipConfig } from 'knip'

const sourceFiles = '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'

const config: KnipConfig = {
  include: ['nsExports', 'nsTypes'],
  // Un alias público puede tener dos nombres usados por clientes. Se informa;
  // los exports sin consumidores siguen siendo errores independientes.
  rules: { duplicates: 'warn' },
  workspaces: {
    '.': {
      entry: [
        // Los tres comandos usan npm_execpath; Knip no resuelve ese launcher dinámico.
        'scripts/verify-gate.mjs',
        'scripts/verify-local.mjs',
        'scripts/oxlint-budget.mjs',
        'scripts/effect-status.mjs',
        'scripts/journeys-local.mjs',
        // Herramientas manuales documentadas y el verificador del hook pre-push.
        'scripts/{cut-graph,verify-receipt-check}.mjs',
        'scripts/**/*.test.mjs',
      ],
      project: [`scripts/${sourceFiles}`],
      // `journeys-local.mjs` lee los puertos del banco vivo con `lsof` y `ps`.
      // El escaneo de secretos usa el CLI de Gitleaks instalado en la máquina.
      // Ninguno de los tres es un paquete de npm de Sherlock.
      ignoreBinaries: ['gitleaks', 'lsof', 'ps'],
    },
    'sherlock/app': {
      // Convex descubre los módulos públicos por nombre. Los helpers anidados
      // deben ser alcanzables desde ellos y no se declaran como entradas.
      entry: [
        'convex/*.ts',
        // RPC interno invocado por string desde upload/seed y tarea del cron.
        'convex/_documents/storage.ts',
        'convex/_documents/internals.ts',
        'convex/_documents/assetUploadIntents.ts',
        // Generador manual y datos cargados por import dinámico desde scripts/demo.
        'e2e/fixtures/generate-viewer-fixtures.mjs',
        'scripts/build-brand-rasters.mjs',
        // Launchers invocados desde wrappers de shell en package.json/CI.
        'scripts/dev-health.mjs',
        'scripts/e2e-browser-preflight.ts',
        'scripts/e2e-reliability-report.ts',
        'scripts/generate-vdr-mcp-fixtures.mjs',
        'scripts/north-star-fitness.ts',
        'scripts/quarantine-next-ds-store.mjs',
      ],
      project: [
        `src/${sourceFiles}`,
        'convex/**/*.ts',
        `scripts/${sourceFiles}`,
        `e2e/${sourceFiles}`,
        '*.{js,mjs,cjs,ts,mts,cts}',
      ],
      ignoreIssues: {
        'convex/_generated/**': ['files', 'exports', 'types'],
      },
      ignoreDependencies: [
        // .husky/commit-msg y .husky/pre-commit hacen cd a este workspace.
        '@commitlint/cli',
        'lint-staged',
        // Cargado por nombre desde .secretlintrc.json.
        '@secretlint/secretlint-rule-preset-recommend',
        // Imports CSS de src/app/globals.css.
        'tailwindcss',
        'tw-animate-css',
        // `mog-renderer-contrast.test.ts` lee el bundle parcheado que declara
        // `mog-sidecar` y bun iza a la raíz. Mismo criterio que `effect` arriba:
        // declararlo otra vez duplicaría la versión en dos manifiestos.
        '@mog-sdk/spreadsheet-app',
      ],
      // CLI instalado en la máquina; check-vercel-env.mjs lo invoca a mano.
      ignoreBinaries: ['vercel', 'lsof', 'ps'],
    },
    'sherlock/app/mog-sidecar': {
      project: [`src/${sourceFiles}`],
    },
  },
}

export default config
