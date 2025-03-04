import { type ISdk } from "./core/sdk"
export type MaybePromise<T> = Promise<T> | T
export type Maybe<T> = NonNullable<T> | undefined
export type MaybeArray<T> = T | T[]

type HTMLResult = string | HTMLElement

// @TODO fix any type usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderHTML = (sdk: ISdk, component?: any) => MaybePromise<HTMLResult>

export type AnalyticsOptions = {
  domains: string[]
  trackingIds: string | string[]
  selectedTrackingId: string | string[]
}

export type Analytics = AnalyticsOptions & {
  track?: (event: string, data: Record<string, unknown>) => void
}

export type Sdk = ISdk
