/**
 * User-scoped assistant personalization: structured memories persisted in localStorage
 * (prototype). In production this would sync to a backend keyed by authenticated user id.
 */

export const PERSONALIZATION_STORAGE_VERSION = 1 as const

/** Stable demo user id — replace with auth subject when integrated. */
export const LOCAL_DEMO_USER_ID = 'local-user'

export const ENTERPRISE_FUNCTIONS = [
  'IT Operations',
  'Security',
  'Network Engineering',
  'Cloud & Hybrid',
  'Collaboration',
  'Data Center',
  'Other',
] as const

export type EnterpriseFunction = (typeof ENTERPRISE_FUNCTIONS)[number]

/** How the user wants recommendations framed (enterprise IT context). */
export type AssistantAdviceStyle =
  | ''
  | 'options-tradeoffs'
  | 'direct-recommendation'
  | 'socratic'

/** Change velocity / risk appetite for rollout-style guidance. */
export type OperationalPosturePref = '' | 'stability-first' | 'balanced' | 'innovation-friendly'

/** High-level role context so the assistant can narrow tone, examples, and priorities. */
export type EnterpriseRoleContext = {
  /** Job title or how the user describes their role */
  roleTitle: string
  /** Team, BU, region, or org unit */
  teamOrgScope: string
  /** Outcomes, mandates, KPIs — what “good” looks like in this role */
  roleMission: string
  /** Who consumes this person’s work (execs, peers, customers, auditors, …) */
  stakeholderAudience: string
  /** Tools, stacks, or platforms to prefer in examples (Meraki, Intersight, …) */
  primaryTools: string
  adviceStyle: AssistantAdviceStyle
  operationalPosture: OperationalPosturePref
}

export const DEFAULT_ENTERPRISE_ROLE_CONTEXT: EnterpriseRoleContext = {
  roleTitle: '',
  teamOrgScope: '',
  roleMission: '',
  stakeholderAudience: '',
  primaryTools: '',
  adviceStyle: '',
  operationalPosture: '',
}

export const ASSISTANT_ADVICE_STYLE_OPTIONS: { value: AssistantAdviceStyle; label: string }[] = [
  { value: '', label: 'Select preference…' },
  { value: 'options-tradeoffs', label: 'Compare options with tradeoffs' },
  { value: 'direct-recommendation', label: 'Prefer a clear recommendation when possible' },
  { value: 'socratic', label: 'Ask clarifying questions before advising' },
]

export const OPERATIONAL_POSTURE_OPTIONS: { value: OperationalPosturePref; label: string }[] = [
  { value: '', label: 'Select posture…' },
  { value: 'stability-first', label: 'Stability-first (minimize change risk)' },
  { value: 'balanced', label: 'Balanced change and reliability' },
  { value: 'innovation-friendly', label: 'Open to newer approaches when justified' },
]

export type PersonalizationEntryKind = 'preference' | 'constraint' | 'context' | 'fact'

export type PersonalizationEntry = {
  id: string
  kind: PersonalizationEntryKind
  /** User-declared fact, preference, constraint, or contextual note */
  content: string
  createdAt: string
  updatedAt: string
}

export type AcronymEntry = {
  id: string
  shorthand: string
  expansion: string
}

/** 0–100 sliders: engagement, response length, detail level */
export type AiToneSettings = {
  engagement: number
  responseLength: number
  detailLevel: number
}

export type ResponseCharacteristics = {
  longAnswers: boolean
  bulletPoints: boolean
  paragraphResponses: boolean
  conclusionSummarization: boolean
}

export const DEFAULT_AI_TONE: AiToneSettings = {
  engagement: 50,
  responseLength: 50,
  detailLevel: 50,
}

export const DEFAULT_CHARACTERISTICS: ResponseCharacteristics = {
  longAnswers: false,
  bulletPoints: false,
  paragraphResponses: false,
  conclusionSummarization: false,
}

export type UserPersonalizationState = {
  userId: string
  enterpriseFunction: EnterpriseFunction | ''
  /** Role, stakeholders, tools — narrows assistant to enterprise context */
  enterpriseRoleContext: EnterpriseRoleContext
  /** High-level response style (sliders 0–100) */
  aiTone: AiToneSettings
  /** Output shape preferences */
  characteristics: ResponseCharacteristics
  /** Role / focus tags (e.g. Information architect) */
  occupationTags: string[]
  /** Extra free-form context; reference default placeholder "Default" */
  moreInformation: string
  /** Custom acronym ↔ expansion pairs */
  acronyms: AcronymEntry[]
  entries: PersonalizationEntry[]
  version: typeof PERSONALIZATION_STORAGE_VERSION
}

function storageKey(userId: string) {
  return `ccc:assistant-personalization:${userId}`
}

function clampTone(n: unknown, fallback: number): number {
  const x = typeof n === 'number' && !Number.isNaN(n) ? n : fallback
  return Math.min(100, Math.max(0, Math.round(x)))
}

function normalizeAiTone(raw: unknown): AiToneSettings {
  const o = raw && typeof raw === 'object' ? (raw as Partial<AiToneSettings>) : {}
  return {
    engagement: clampTone(o.engagement, DEFAULT_AI_TONE.engagement),
    responseLength: clampTone(o.responseLength, DEFAULT_AI_TONE.responseLength),
    detailLevel: clampTone(o.detailLevel, DEFAULT_AI_TONE.detailLevel),
  }
}

function normalizeCharacteristics(raw: unknown): ResponseCharacteristics {
  const o = raw && typeof raw === 'object' ? (raw as Partial<ResponseCharacteristics>) : {}
  return {
    longAnswers: Boolean(o.longAnswers),
    bulletPoints: Boolean(o.bulletPoints),
    paragraphResponses: Boolean(o.paragraphResponses),
    conclusionSummarization: Boolean(o.conclusionSummarization),
  }
}

const ADVICE_STYLE_SET = new Set<AssistantAdviceStyle>([
  '',
  'options-tradeoffs',
  'direct-recommendation',
  'socratic',
])

const POSTURE_SET = new Set<OperationalPosturePref>([
  '',
  'stability-first',
  'balanced',
  'innovation-friendly',
])

function normalizeEnterpriseRoleContext(raw: unknown): EnterpriseRoleContext {
  const d = DEFAULT_ENTERPRISE_ROLE_CONTEXT
  const o = raw && typeof raw === 'object' ? (raw as Partial<EnterpriseRoleContext>) : {}
  const adviceStyle =
    typeof o.adviceStyle === 'string' && ADVICE_STYLE_SET.has(o.adviceStyle as AssistantAdviceStyle)
      ? (o.adviceStyle as AssistantAdviceStyle)
      : d.adviceStyle
  const operationalPosture =
    typeof o.operationalPosture === 'string' &&
    POSTURE_SET.has(o.operationalPosture as OperationalPosturePref)
      ? (o.operationalPosture as OperationalPosturePref)
      : d.operationalPosture
  return {
    roleTitle: typeof o.roleTitle === 'string' ? o.roleTitle : d.roleTitle,
    teamOrgScope: typeof o.teamOrgScope === 'string' ? o.teamOrgScope : d.teamOrgScope,
    roleMission: typeof o.roleMission === 'string' ? o.roleMission : d.roleMission,
    stakeholderAudience:
      typeof o.stakeholderAudience === 'string' ? o.stakeholderAudience : d.stakeholderAudience,
    primaryTools: typeof o.primaryTools === 'string' ? o.primaryTools : d.primaryTools,
    adviceStyle,
    operationalPosture,
  }
}

function defaultState(userId: string): UserPersonalizationState {
  return {
    userId,
    enterpriseFunction: '',
    enterpriseRoleContext: { ...DEFAULT_ENTERPRISE_ROLE_CONTEXT },
    aiTone: { ...DEFAULT_AI_TONE },
    characteristics: { ...DEFAULT_CHARACTERISTICS },
    occupationTags: [],
    moreInformation: '',
    acronyms: [],
    entries: [],
    version: PERSONALIZATION_STORAGE_VERSION,
  }
}

export function loadUserPersonalization(userId: string): UserPersonalizationState {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return defaultState(userId)
    const parsed = JSON.parse(raw) as UserPersonalizationState
    if (!parsed || parsed.version !== PERSONALIZATION_STORAGE_VERSION || !Array.isArray(parsed.entries)) {
      return defaultState(userId)
    }
    const acronymsRaw = Array.isArray(parsed.acronyms) ? parsed.acronyms : []
    const acronyms: AcronymEntry[] = acronymsRaw
      .filter((a) => a?.id && typeof a?.shorthand === 'string' && typeof a?.expansion === 'string')
      .map((a) => ({
        id: a.id,
        shorthand: a.shorthand,
        expansion: a.expansion,
      }))
    const occupationTags = Array.isArray(parsed.occupationTags)
      ? parsed.occupationTags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : []

    return {
      ...defaultState(userId),
      ...parsed,
      userId,
      enterpriseRoleContext: normalizeEnterpriseRoleContext(parsed.enterpriseRoleContext),
      aiTone: normalizeAiTone(parsed.aiTone),
      characteristics: normalizeCharacteristics(parsed.characteristics),
      occupationTags,
      moreInformation:
        typeof parsed.moreInformation === 'string' ? parsed.moreInformation : '',
      acronyms,
      entries: parsed.entries.filter((e) => e?.id && e?.kind && typeof e?.content === 'string'),
    }
  } catch {
    return defaultState(userId)
  }
}

export function saveUserPersonalization(state: UserPersonalizationState): void {
  try {
    localStorage.setItem(storageKey(state.userId), JSON.stringify(state))
    window.dispatchEvent(
      new CustomEvent('ccc-personalization-changed', { detail: { userId: state.userId } })
    )
  } catch {
    /* quota or private mode */
  }
}

/** Text block injected into assistant context (system / developer preamble). */
export function formatPersonalizationForAssistantContext(userId: string): string {
  const data = loadUserPersonalization(userId)
  const lines: string[] = []
  lines.push('## User personalization (remember across sessions)')
  const erc = data.enterpriseRoleContext
  const ercLabel = (map: Record<string, string>, key: string) => map[key] ?? key
  const adviceLabels: Record<string, string> = {
    'options-tradeoffs': 'compare options with tradeoffs',
    'direct-recommendation': 'prefer a direct recommendation when possible',
    socratic: 'ask clarifying questions before advising',
  }
  const postureLabels: Record<string, string> = {
    'stability-first': 'stability-first (minimize change risk)',
    balanced: 'balanced change and reliability',
    'innovation-friendly': 'open to newer approaches when justified',
  }
  const hasErc =
    erc.roleTitle.trim().length > 0 ||
    erc.teamOrgScope.trim().length > 0 ||
    erc.roleMission.trim().length > 0 ||
    erc.stakeholderAudience.trim().length > 0 ||
    erc.primaryTools.trim().length > 0 ||
    erc.adviceStyle !== '' ||
    erc.operationalPosture !== ''
  if (data.enterpriseFunction) {
    lines.push(`Enterprise function: ${data.enterpriseFunction}.`)
  }
  if (hasErc) {
    lines.push('### Enterprise role & outcomes')
    if (erc.roleTitle.trim()) {
      lines.push(`Role title: ${erc.roleTitle.trim()}`)
    }
    if (erc.teamOrgScope.trim()) {
      lines.push(`Team / org scope: ${erc.teamOrgScope.trim()}`)
    }
    if (erc.roleMission.trim()) {
      lines.push(`Mission & outcomes (what to optimize for): ${erc.roleMission.trim()}`)
    }
    if (erc.stakeholderAudience.trim()) {
      lines.push(`Primary audience / stakeholders: ${erc.stakeholderAudience.trim()}`)
    }
    if (erc.primaryTools.trim()) {
      lines.push(`Primary tools & platforms (prefer in examples): ${erc.primaryTools.trim()}`)
    }
    if (erc.adviceStyle) {
      lines.push(`How to advise: ${ercLabel(adviceLabels, erc.adviceStyle)}.`)
    }
    if (erc.operationalPosture) {
      lines.push(`Operational posture: ${ercLabel(postureLabels, erc.operationalPosture)}.`)
    }
  }
  lines.push('### AI tone (high level)')
  lines.push(
    `- Engagement (information-only … active contributor): ${data.aiTone.engagement}/100`
  )
  lines.push(
    `- Response length (short … long): ${data.aiTone.responseLength}/100`
  )
  lines.push(
    `- Detail (brief … detailed): ${data.aiTone.detailLevel}/100`
  )
  const ch = data.characteristics
  const chOn = (
    [
      ch.longAnswers && 'prefer long answers',
      ch.bulletPoints && 'use bullet points',
      ch.paragraphResponses && 'use paragraph responses',
      ch.conclusionSummarization && 'add conclusion summary after each response',
    ].filter(Boolean) as string[]
  )
  lines.push(
    `Response characteristics: ${chOn.length ? chOn.join('; ') : 'none selected (defaults apply).'}`
  )
  if (data.occupationTags.length > 0) {
    lines.push(`Occupation / role tags: ${data.occupationTags.join('; ')}.`)
  }
  if (data.moreInformation.trim()) {
    lines.push(`Additional context: ${data.moreInformation.trim()}`)
  }
  if (data.acronyms.length > 0) {
    lines.push('### Acronyms / shorthand')
    for (const a of data.acronyms) {
      lines.push(`- ${a.shorthand} → ${a.expansion}`)
    }
  }
  if (data.entries.length === 0) {
    lines.push('No explicit structured memory entries yet.')
  } else {
    const byKind = (k: PersonalizationEntryKind) => data.entries.filter((e) => e.kind === k)
    const sections: [PersonalizationEntryKind, string][] = [
      ['preference', 'Preferences'],
      ['constraint', 'Constraints'],
      ['context', 'Context'],
      ['fact', 'Declared facts'],
    ]
    for (const [kind, label] of sections) {
      const items = byKind(kind)
      if (items.length === 0) continue
      lines.push(`### ${label}`)
      for (const e of items) {
        lines.push(`- (${e.kind}) ${e.content.trim()}`)
      }
    }
  }
  return lines.join('\n')
}

export function personalizationEntryCount(userId: string): number {
  return loadUserPersonalization(userId).entries.length
}

function aiToneDiffersFromDefault(t: AiToneSettings): boolean {
  return (
    t.engagement !== DEFAULT_AI_TONE.engagement ||
    t.responseLength !== DEFAULT_AI_TONE.responseLength ||
    t.detailLevel !== DEFAULT_AI_TONE.detailLevel
  )
}

function anyCharacteristicOn(c: ResponseCharacteristics): boolean {
  return (
    c.longAnswers ||
    c.bulletPoints ||
    c.paragraphResponses ||
    c.conclusionSummarization
  )
}

function enterpriseRoleContextPopulated(r: EnterpriseRoleContext): boolean {
  return (
    r.roleTitle.trim().length > 0 ||
    r.teamOrgScope.trim().length > 0 ||
    r.roleMission.trim().length > 0 ||
    r.stakeholderAudience.trim().length > 0 ||
    r.primaryTools.trim().length > 0 ||
    r.adviceStyle !== '' ||
    r.operationalPosture !== ''
  )
}

/** True when any persisted personalization should be merged into assistant context. */
export function userHasPersonalizationContext(userId: string): boolean {
  const data = loadUserPersonalization(userId)
  return (
    aiToneDiffersFromDefault(data.aiTone) ||
    anyCharacteristicOn(data.characteristics) ||
    enterpriseRoleContextPopulated(data.enterpriseRoleContext) ||
    Boolean(data.enterpriseFunction) ||
    data.occupationTags.length > 0 ||
    data.moreInformation.trim().length > 0 ||
    data.acronyms.length > 0 ||
    data.entries.some((e) => e.content.trim().length > 0)
  )
}
