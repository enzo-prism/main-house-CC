import { describe, expect, it } from 'vitest'

import { isGoogleHost } from './google-hosts'

describe('isGoogleHost', () => {
  it('blocks google.com, www.google.com, and Ads conversion hosts', () => {
    expect(isGoogleHost('google.com')).toBe(true)
    expect(isGoogleHost('www.google.com')).toBe(true)
    expect(isGoogleHost('google.com')).toBe(true)
    expect(isGoogleHost('www.googleadservices.com')).toBe(true)
    expect(isGoogleHost('googleadservices.com')).toBe(true)
    expect(isGoogleHost('www.google.com')).toBe(true)
  })

  it('does not treat Main House or lookalikes as Google', () => {
    expect(isGoogleHost('mainhouse.canarycove.com')).toBe(false)
    expect(isGoogleHost('notgoogle.com')).toBe(false)
    expect(isGoogleHost('google.com.evil.test')).toBe(false)
  })
})
