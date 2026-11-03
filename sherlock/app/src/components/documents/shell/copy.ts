// Copy del shell del data room. Diccionario por locale, español panameño
// (tuteo), sin emojis.
//
// ===== LA COSTURA CON EFFECT =====
// El único locale del sitio ([F] 2026-09-03, DECISIONS) se define con
// `Schema.Literals` sobre `locales` de `@/i18n/config`, no con un `'es'`
// suelto. El `satisfies` sigue siendo el candado de TypeScript: si la lista
// crece, el diccionario que falte no compila. El recorrido de `.literals` es
// el consumidor en runtime, para que el schema no quede como un valor que
// solo produce un tipo.

import { Schema } from 'effect'

import { locales, type Locale } from '@/i18n/config'

const RoomLocaleSchema = Schema.Literals(locales)
export type RoomLocale = Locale

const ROOM_FOLDER_HINTS_ES: Record<string, string> = {
  room_legal: 'Suelta aquí un contrato con un cliente, un proveedor o un banco.',
  room_corporate: 'Suelta aquí el registro público, el pacto social o un acta de junta.',
  room_financial: 'Suelta aquí los estados financieros de los últimos 3 a 5 años.',
  room_operations: 'Opcional por ahora. Licencias, contratos operativos o fotos de la planta.',
  room_marketing: 'Opcional por ahora. Un pitch, un catálogo o fotos del producto.',
}

const ROOM_FOLDER_HINTS_EN: Record<string, string> = {
  room_legal: 'Drop a contract with a client, a supplier or a bank here.',
  room_corporate:
    'Drop the public registry record, the articles of incorporation or board minutes here.',
  room_financial: 'Drop the financial statements for the last 3 to 5 years here.',
  room_operations: 'Optional for now. Licenses, operating contracts or photos of the plant.',
  room_marketing: 'Optional for now. A pitch, a catalog or photos of the product.',
}

export const ROOM_SHELL_COPY = {
  es: {
    region: 'Sistema de archivos del Data Room',
    tree: 'Carpetas',
    treeDescription: 'Cinco carpetas fijas. Los documentos se mueven entre ellas.',
    treeSelectionChanged: (count: number) =>
      count === 1 ? '1 documento seleccionado' : `${count} documentos seleccionados`,
    treeSelectionLimitReached: (max: number) =>
      max === 1
        ? 'Solo puedes seleccionar 1 documento'
        : `Puedes seleccionar hasta ${max} documentos`,
    treeRevealed: (label: string) => `Documento revelado: ${label}`,
    treeActiveChanged: (label: string) => `Documento activo: ${label}`,
    renameInput: (name: string) => `Renombrar ${name}`,
    renamePending: (name: string) => `Renombrando documento como ${name}`,
    renameSucceeded: (name: string) => `Documento renombrado: ${name}`,
    renameFailed: (name: string) => `No pudimos renombrar ${name}`,
    renameCancelled: (name: string) => `Cambio de nombre cancelado para ${name}`,
    renameEmpty: 'Escribe un nombre para el documento',
    dropConflictTitle: 'Cambiar carpeta de carga',
    dropConflictDescription: (currentFolder: string, nextFolder: string) =>
      `Ya tienes archivos en ${currentFolder}. Si continúas, toda la tanda se cargará en ${nextFolder}.`,
    dropConflictClose: 'Cerrar confirmación de carpeta',
    dropConflictCancel: 'Mantener carpeta actual',
    dropConflictConfirm: 'Cambiar carpeta',
    dropConflictPending: 'Cambiando carpeta',
    bulkSelectDocument: (name: string) => `Seleccionar ${name}`,
    bulkSelectLoadedFolder: (folder: string) => `Seleccionar documentos cargados de ${folder}`,
    bulkDocumentDisabled: (name: string, reason: string) =>
      `No puedes seleccionar ${name}: ${reason}`,
    bulkSummary: (selected: number, hidden: number) =>
      `${selected} ${selected === 1 ? 'seleccionado' : 'seleccionados'}${
        hidden > 0 ? `, ${hidden} fuera de esta vista` : ''
      }`,
    bulkMove: 'Mover',
    bulkDisclosure: 'Divulgación',
    bulkArchive: 'Archivar',
    bulkPurge: 'Borrar',
    bulkClear: 'Limpiar',
    bulkMoveTitle: 'Mover documentos',
    bulkMoveDescription: (count: number) =>
      `Mueve ${count} ${count === 1 ? 'documento' : 'documentos'} dentro de este Data Room. El acceso no cambiará.`,
    bulkDestinationFolder: 'Carpeta de destino',
    bulkDestinationPlaceholder: 'Elige una carpeta',
    bulkConfirmMove: 'Confirmar movimiento',
    bulkMoveNoop: 'Ya tienes esos documentos en esta carpeta.',
    bulkDisclosureTitle: 'Cambiar divulgación',
    bulkDisclosureDescription: (count: number) =>
      `El cambio se aplicará a ${count} ${count === 1 ? 'documento' : 'documentos'} y revocará los accesos abiertos.`,
    bulkAccessPlaceholder: 'Elige quién puede ver',
    bulkClassification: 'Clasificación',
    bulkClassificationPlaceholder: 'Elige la clasificación',
    bulkDeclassifyWarning: (count: number) =>
      count === 1
        ? 'Estás ampliando quién puede ver este documento. Los accesos abiertos se revocarán.'
        : `Estás ampliando quién puede ver estos ${count} documentos. Los accesos abiertos se revocarán.`,
    bulkConfirmDisclosure: 'Confirmar divulgación',
    bulkArchiveTitle: '¿Archivar la selección?',
    bulkArchiveDescription: (count: number) =>
      count === 1
        ? '1 documento saldrá del Data Room activo. Su archivo, versiones y auditoría permanecerán protegidos.'
        : `${count} documentos saldrán del Data Room activo. Sus archivos, versiones y auditoría permanecerán protegidos.`,
    bulkPurgeTitle: (count: number) =>
      count === 1 ? '¿Borrar este documento?' : `¿Borrar ${count} documentos?`,
    bulkPurgeTeamDeliverable: (names: readonly string[]) =>
      names.length === 1
        ? `«${names[0]}» la preparó el equipo de Sherlock. Pídele al equipo que la retire y vuelve a intentarlo.`
        : `${names.map((name) => `«${name}»`).join(', ')} las preparó el equipo de Sherlock. Pídele al equipo que las retire y vuelve a intentarlo.`,
    bulkCancel: 'Cancelar',
    documentIndex: 'Índice documental',
    search: 'Buscar documentos',
    searchPlaceholder: 'Buscar por nombre',
    sort: 'Orden',
    sortProcess: 'Proceso',
    sortName: 'Nombre',
    sortModified: 'Modificado',
    // Cada carpeta vacía dice qué archivo va ahí, en las palabras del dueño de
    // una pyme y no del due diligence: «Carpeta vacía» no invitaba a soltar nada.
    emptyFolder: (folder: string) =>
      ROOM_FOLDER_HINTS_ES[folder] ?? 'Suelta aquí lo que corresponda.',
    folderNoMatchesTitle: 'Sin coincidencias en esta carpeta',
    folderNoMatches: (count: number, term: string) =>
      count === 1
        ? `Esta carpeta tiene 1 documento, pero ninguno coincide con “${term}”.`
        : `Esta carpeta tiene ${count} documentos, pero ninguno coincide con “${term}”.`,
    folderMoreBelow: (count: number) =>
      count === 1
        ? '1 documento más abajo: carga más para verlo.'
        : `${count} documentos más abajo: carga más para verlos.`,
    emptyRoom: 'Todavía no hay documentos en este Data Room.',
    upload: 'Subir documento',
    activity: 'Ver actividad',
    results: (visible: number, total: number, searching = false) =>
      searching
        ? total === 1
          ? `Mostrando ${visible} de 1 resultado`
          : `Mostrando ${visible} de ${total} resultados`
        : total === 1
          ? `Mostrando ${visible} de 1 documento`
          : `Mostrando ${visible} de ${total} documentos`,
    loadMore: (count: number) =>
      count === 1 ? 'Cargar 1 documento más' : `Cargar ${count} documentos más`,
    centerEmptyTitle: 'Abre un archivo para verlo aquí',
    centerEmptyDescription: 'Elige uno a la izquierda o suéltalo en la carpeta que le toca.',
    centerMissing: 'Te falta',
    centerOptional: (folders: readonly string[]) =>
      `Opcional por ahora: ${new Intl.ListFormat('es-PA', { type: 'conjunction' }).format(folders)}.`,
    centerRecent: 'Últimos movimientos',
    noResultsTitle: 'Sin coincidencias',
    noResultsFor: (term: string) => `Ningún documento del Data Room coincide con “${term}”.`,
    clearSearch: 'Limpiar búsqueda',
    coverNoMatches: (total: number) =>
      total === 1 ? 'Sin coincidencias en 1 documento' : `Sin coincidencias en ${total} documentos`,
    coverResults: (matches: number, total: number) => {
      const matchLabel = matches === 1 ? '1 resultado' : `${matches} resultados`
      const totalLabel = total === 1 ? '1 documento' : `${total} documentos`
      return `${matchLabel} de ${totalLabel}`
    },
    open: 'Abrir',
    download: 'Descargar',
    close: 'Cerrar',
    closeViewer: 'Cerrar visor',
    documentCard: 'Documento seleccionado',
    fileType: 'Tipo',
    fileSize: 'Tamaño',
    version: 'Versión',
    versionShort: (value: number) => `v${value}`,
    modified: 'Modificado',
    folder: 'Carpeta',
    access: 'Acceso',
    state: 'Estado',
    accessPublic: 'Público',
    accessNda: 'NDA',
    accessPrivate: 'Privado',
    statusReady: 'Publicado',
    statusPending: 'Pendiente',
    statusScanning: 'En escaneo',
    statusQuarantined: 'En cuarentena',
    statusArchived: 'Archivado',
    actions: 'Acciones del documento',
    rename: 'Renombrar',
    info: 'Información',
    moveTo: 'Mover a carpeta',
    archive: 'Archivar',
    purge: 'Borrar',
    purgeTitle: (name: string) => `¿Borrar «${name}»?`,
    // Un solo cuerpo para la fila y para el lote: el hecho que se confirma es
    // el mismo y no admite dos redacciones.
    purgeDescription: 'Se borra de forma permanente con todas sus versiones. No se puede deshacer.',
    newVersion: 'Subir nueva versión',
    metadata: 'Metadata',
    versionHistoryOpen: 'Historial de versiones',
    versionHistoryUnavailable: 'El historial aparece cuando subes tus propios documentos.',
    resizeTree: 'Ajustar ancho del árbol de carpetas',
    demoNoBytes: 'Los documentos de ejemplo no tienen archivo que abrir o descargar.',
    downloadError: 'No pudimos preparar la descarga. Intenta de nuevo.',
    downloadZip: 'Descargar todo (.zip)',
    downloadZipPending: 'Preparando el zip…',
    downloadZipStarted: 'Tu descarga empezó.',
    downloadZipError: 'No pudimos preparar el zip. Intenta de nuevo.',
    downloadZipTooLarge:
      'El Data Room supera el límite de 250 MB. Descarga los documentos por separado.',
    downloadZipEmpty: 'No hay documentos publicados para descargar.',
    downloadFolderZip: 'Descargar carpeta (.zip)',
    downloadFolderZipEmpty: 'Esta carpeta no tiene documentos publicados para descargar.',
    openError: 'No pudimos preparar el documento. Intenta de nuevo.',
    retryOpen: 'Intentar de nuevo',
    moveSuccess: 'Documento movido.',
    moveError: 'No pudimos mover el documento.',
    coverDocuments: (count: number) => (count === 1 ? '1 documento' : `${count} documentos`),
    coverUpdated: 'Última actualización',
    coverNoUpdate: 'Sin documentos todavía',
    coverRenameAction: 'Editar nombre',
    coverRenameInput: 'Nombre de la empresa',
    coverRenameSave: 'Guardar',
    coverRenameCancel: 'Cancelar',
    coverRenameEmpty: 'Escribe el nombre de tu empresa',
    coverRenameSucceeded: (name: string) => `Nombre actualizado: ${name}`,
    coverRenameFailed: 'No pudimos actualizar el nombre',
    mandateDebt: 'Mandato de deuda',
    mandateEquity: 'Mandato de equity',
    mandateBoth: 'Mandato de deuda y equity',
    mandateBridge: 'Financiamiento puente',
    mandatePreparation: 'Preparación sell-side',
    foldersToggle: 'Carpetas',
    foldersHide: 'Ocultar carpetas',
    loadingDocument: 'Preparando el documento',
    provenance: 'Procedencia',
    deliveryNote: 'Nota del equipo',
    sourcePublic: 'Fuente pública',
    sourceMycroft: 'Preparado por el equipo de Sherlock',
    sourceUpload: 'Subido por la empresa',
    sourceDemo: 'Documento de ejemplo',
    scanStatus: 'Revisión del archivo',
    scanReady: 'Revisado y publicado en el Data Room',
    scanPending: 'Esperando el archivo',
    scanScanning: 'Revisando el archivo antes de publicarlo',
    scanQuarantined: 'El archivo no pasó la revisión. El equipo lo está viendo.',
    scanArchived: 'Archivado; ya no se muestra en el Data Room',
    kindSpreadsheet: 'Hoja de cálculo',
    kindPdf: 'PDF',
    kindDocument: 'Documento de texto',
    kindPresentation: 'Presentación',
    kindImage: 'Imagen',
    kindOther: 'Archivo',
  },
  en: {
    region: 'Data Room file system',
    tree: 'Folders',
    treeDescription: 'Five fixed folders. Documents move between them.',
    treeSelectionChanged: (count: number) =>
      count === 1 ? '1 document selected' : `${count} documents selected`,
    treeSelectionLimitReached: (max: number) =>
      max === 1 ? 'You can only select 1 document' : `You can select up to ${max} documents`,
    treeRevealed: (label: string) => `Document revealed: ${label}`,
    treeActiveChanged: (label: string) => `Active document: ${label}`,
    renameInput: (name: string) => `Rename ${name}`,
    renamePending: (name: string) => `Renaming document to ${name}`,
    renameSucceeded: (name: string) => `Document renamed: ${name}`,
    renameFailed: (name: string) => `We could not rename ${name}`,
    renameCancelled: (name: string) => `Rename cancelled for ${name}`,
    renameEmpty: 'Enter a name for the document',
    dropConflictTitle: 'Change upload folder',
    dropConflictDescription: (currentFolder: string, nextFolder: string) =>
      `You already have files in ${currentFolder}. If you continue, the whole batch will be uploaded to ${nextFolder}.`,
    dropConflictClose: 'Close folder confirmation',
    dropConflictCancel: 'Keep current folder',
    dropConflictConfirm: 'Change folder',
    dropConflictPending: 'Changing folder',
    bulkSelectDocument: (name: string) => `Select ${name}`,
    bulkSelectLoadedFolder: (folder: string) => `Select loaded documents in ${folder}`,
    bulkDocumentDisabled: (name: string, reason: string) => `You cannot select ${name}: ${reason}`,
    bulkSummary: (selected: number, hidden: number) =>
      `${selected} selected${hidden > 0 ? `, ${hidden} outside this view` : ''}`,
    bulkMove: 'Move',
    bulkDisclosure: 'Disclosure',
    bulkArchive: 'Archive',
    bulkPurge: 'Delete',
    bulkClear: 'Clear',
    bulkMoveTitle: 'Move documents',
    bulkMoveDescription: (count: number) =>
      `Move ${count} ${count === 1 ? 'document' : 'documents'} within this Data Room. Access will not change.`,
    bulkDestinationFolder: 'Destination folder',
    bulkDestinationPlaceholder: 'Choose a folder',
    bulkConfirmMove: 'Confirm move',
    bulkMoveNoop: 'Those documents are already in this folder.',
    bulkDisclosureTitle: 'Change disclosure',
    bulkDisclosureDescription: (count: number) =>
      `The change will apply to ${count} ${count === 1 ? 'document' : 'documents'} and will revoke open access.`,
    bulkAccessPlaceholder: 'Choose who can view',
    bulkClassification: 'Classification',
    bulkClassificationPlaceholder: 'Choose the classification',
    bulkDeclassifyWarning: (count: number) =>
      count === 1
        ? 'You are widening who can view this document. Open access will be revoked.'
        : `You are widening who can view these ${count} documents. Open access will be revoked.`,
    bulkConfirmDisclosure: 'Confirm disclosure',
    bulkArchiveTitle: 'Archive the selection?',
    bulkArchiveDescription: (count: number) =>
      count === 1
        ? '1 document will leave the active Data Room. Its file, versions and audit trail will stay protected.'
        : `${count} documents will leave the active Data Room. Their files, versions and audit trail will stay protected.`,
    bulkPurgeTitle: (count: number) =>
      count === 1 ? 'Delete this document?' : `Delete ${count} documents?`,
    bulkPurgeTeamDeliverable: (names: readonly string[]) =>
      names.length === 1
        ? `“${names[0]}” was prepared by the Sherlock team. Ask the team to withdraw it and try again.`
        : `${names.map((name) => `“${name}”`).join(', ')} were prepared by the Sherlock team. Ask the team to withdraw them and try again.`,
    bulkCancel: 'Cancel',
    documentIndex: 'Document index',
    search: 'Search documents',
    searchPlaceholder: 'Search by name',
    sort: 'Sort',
    sortProcess: 'Process',
    sortName: 'Name',
    sortModified: 'Modified',
    emptyFolder: (folder: string) =>
      ROOM_FOLDER_HINTS_EN[folder] ?? 'Drop here whatever belongs in this folder.',
    folderNoMatchesTitle: 'No matches in this folder',
    folderNoMatches: (count: number, term: string) =>
      count === 1
        ? `This folder has 1 document, but none matches “${term}”.`
        : `This folder has ${count} documents, but none matches “${term}”.`,
    folderMoreBelow: (count: number) =>
      count === 1
        ? '1 more document below: load more to see it.'
        : `${count} more documents below: load more to see them.`,
    emptyRoom: 'There are no documents in this Data Room yet.',
    upload: 'Upload document',
    activity: 'View activity',
    results: (visible: number, total: number, searching = false) =>
      searching
        ? total === 1
          ? `Showing ${visible} of 1 result`
          : `Showing ${visible} of ${total} results`
        : total === 1
          ? `Showing ${visible} of 1 document`
          : `Showing ${visible} of ${total} documents`,
    loadMore: (count: number) =>
      count === 1 ? 'Load 1 more document' : `Load ${count} more documents`,
    centerEmptyTitle: 'Open a file to view it here',
    centerEmptyDescription: 'Pick one on the left or drop it in the folder where it belongs.',
    centerMissing: 'Missing',
    centerOptional: (folders: readonly string[]) =>
      `Optional for now: ${new Intl.ListFormat('en-US', { type: 'conjunction' }).format(folders)}.`,
    centerRecent: 'Latest activity',
    noResultsTitle: 'No matches',
    noResultsFor: (term: string) => `No Data Room document matches “${term}”.`,
    clearSearch: 'Clear search',
    coverNoMatches: (total: number) =>
      total === 1 ? 'No matches in 1 document' : `No matches in ${total} documents`,
    coverResults: (matches: number, total: number) => {
      const matchLabel = matches === 1 ? '1 result' : `${matches} results`
      const totalLabel = total === 1 ? '1 document' : `${total} documents`
      return `${matchLabel} from ${totalLabel}`
    },
    open: 'Open',
    download: 'Download',
    close: 'Close',
    closeViewer: 'Close viewer',
    documentCard: 'Selected document',
    fileType: 'Type',
    fileSize: 'Size',
    version: 'Version',
    versionShort: (value: number) => `v${value}`,
    modified: 'Modified',
    folder: 'Folder',
    access: 'Access',
    state: 'Status',
    accessPublic: 'Public',
    accessNda: 'NDA',
    accessPrivate: 'Private',
    statusReady: 'Published',
    statusPending: 'Pending',
    statusScanning: 'Scanning',
    statusQuarantined: 'Quarantined',
    statusArchived: 'Archived',
    actions: 'Document actions',
    rename: 'Rename',
    info: 'Information',
    moveTo: 'Move to folder',
    archive: 'Archive',
    purge: 'Delete',
    purgeTitle: (name: string) => `Delete “${name}”?`,
    purgeDescription:
      'It is permanently deleted along with all its versions. This cannot be undone.',
    newVersion: 'Upload new version',
    metadata: 'Metadata',
    versionHistoryOpen: 'Version history',
    versionHistoryUnavailable: 'The history appears once you upload your own documents.',
    resizeTree: 'Resize the folder tree width',
    demoNoBytes: 'Sample documents have no file to open or download.',
    downloadError: 'We could not prepare the download. Try again.',
    downloadZip: 'Download all (.zip)',
    downloadZipPending: 'Preparing the zip…',
    downloadZipStarted: 'Your download has started.',
    downloadZipError: 'We could not prepare the zip. Try again.',
    downloadZipTooLarge:
      'The Data Room exceeds the 250 MB limit. Download the documents separately.',
    downloadZipEmpty: 'There are no published documents to download.',
    downloadFolderZip: 'Download folder (.zip)',
    downloadFolderZipEmpty: 'This folder has no published documents to download.',
    openError: 'We could not prepare the document. Try again.',
    retryOpen: 'Try again',
    moveSuccess: 'Document moved.',
    moveError: 'We could not move the document.',
    coverDocuments: (count: number) => (count === 1 ? '1 document' : `${count} documents`),
    coverUpdated: 'Last updated',
    coverNoUpdate: 'No documents yet',
    coverRenameAction: 'Edit name',
    coverRenameInput: 'Company name',
    coverRenameSave: 'Save',
    coverRenameCancel: 'Cancel',
    coverRenameEmpty: 'Enter your company name',
    coverRenameSucceeded: (name: string) => `Name updated: ${name}`,
    coverRenameFailed: 'We could not update the name',
    mandateDebt: 'Debt mandate',
    mandateEquity: 'Equity mandate',
    mandateBoth: 'Debt and equity mandate',
    mandateBridge: 'Bridge financing',
    mandatePreparation: 'Sell-side preparation',
    foldersToggle: 'Folders',
    foldersHide: 'Hide folders',
    loadingDocument: 'Preparing the document',
    provenance: 'Provenance',
    deliveryNote: 'Team note',
    sourcePublic: 'Public source',
    sourceMycroft: 'Prepared by the Sherlock team',
    sourceUpload: 'Uploaded by the company',
    sourceDemo: 'Sample document',
    scanStatus: 'File review',
    scanReady: 'Reviewed and published in the Data Room',
    scanPending: 'Waiting for the file',
    scanScanning: 'Reviewing the file before publishing it',
    scanQuarantined: 'The file did not pass review. The team is looking into it.',
    scanArchived: 'Archived; no longer shown in the Data Room',
    kindSpreadsheet: 'Spreadsheet',
    kindPdf: 'PDF',
    kindDocument: 'Text document',
    kindPresentation: 'Presentation',
    kindImage: 'Image',
    kindOther: 'File',
  },
} satisfies Record<typeof RoomLocaleSchema.Type, unknown>

// La forma de referencia es la del español; `roomShellCopyFor` devuelve cada
// idioma tipado como `RoomShellCopy`, así que un `en` que difiera no compila.
export type RoomShellCopy = (typeof ROOM_SHELL_COPY)['es']

const isRoomLocale = Schema.is(RoomLocaleSchema)

function roomShellCopyFor(locale: unknown): RoomShellCopy {
  return isRoomLocale(locale) ? ROOM_SHELL_COPY[locale] : ROOM_SHELL_COPY.es
}

const defaultRoomShellCopy = roomShellCopyFor(RoomLocaleSchema.literals[0])
if (defaultRoomShellCopy !== ROOM_SHELL_COPY.es) {
  throw new Error('ROOM_SHELL_COPY: el catálogo de locales no coincide con el diccionario')
}
