import { afterAll, beforeAll, describe, expect, it, test, vi } from 'vitest'
import { cronExpressionMatchesNow } from './cronUtils'

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30

// TODO: Cleanup tests, give better coverage and with less overlap
describe('cronExpressionMatchesNow', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  afterAll(() => {
    vi.useRealTimers()
  })

  test.each([MINUTE, HOUR, DAY, WEEK, MONTH])(
    'always returns true for * * * * *',
    (time) => {
      vi.advanceTimersByTime(time)

      expect(cronExpressionMatchesNow('* * * * *')).toBe(true)
    }
  )

  it('returns true when the minute matches', () => {
    vi.setSystemTime(new Date('2021-01-01T00:05:00'))

    expect(cronExpressionMatchesNow('5 * * * *')).toBe(true)

    vi.setSystemTime(new Date('2021-01-01T00:06:00'))

    expect(cronExpressionMatchesNow('5 * * * *')).toBe(false)
  })

  it('returns true when the hour matches', () => {
    vi.setSystemTime(new Date('2021-01-01T05:00:00'))

    expect(cronExpressionMatchesNow('* 5 * * *')).toBe(true)

    vi.setSystemTime(new Date('2021-01-01T06:00:00'))

    expect(cronExpressionMatchesNow('* 5 * * *')).toBe(false)
  })

  it('returns true when the day of month matches', () => {
    vi.setSystemTime(new Date('2021-01-05T00:00:00'))

    expect(cronExpressionMatchesNow('* * 5 * *')).toBe(true)

    vi.setSystemTime(new Date('2021-01-06T00:00:00'))

    expect(cronExpressionMatchesNow('* * 5 * *')).toBe(false)
  })

  it('returns true when the month matches', () => {
    vi.setSystemTime(new Date('2021-05-01T00:00:00'))

    expect(cronExpressionMatchesNow('* * * 5 *')).toBe(true)

    vi.setSystemTime(new Date('2021-06-01T00:00:00'))

    expect(cronExpressionMatchesNow('* * * 5 *')).toBe(false)
  })

  it('returns true when the day of week matches', () => {
    vi.setSystemTime(new Date('2023-01-05T00:00:00'))

    expect(cronExpressionMatchesNow('* * * * 5')).toBe(true)

    vi.setSystemTime(new Date('2023-01-02T00:00:00'))

    expect(cronExpressionMatchesNow('* * * * 5')).toBe(false)
  })

  it('returns true when all fields match', () => {
    vi.setSystemTime(new Date('2023-01-02T03:05:00'))

    expect(cronExpressionMatchesNow('5 3 2 1 2')).toBe(true)

    vi.setSystemTime(new Date('2023-01-03T03:05:00'))

    expect(cronExpressionMatchesNow('5 3 2 1 2')).toBe(false)
  })

  test.each([
    ['01', false],
    ['02', true],
    ['03', true],
    ['04', true],
    ['05', false],
  ])('2021-01-%s returns %s for * * 2-4 * *', (day, expected) => {
    vi.setSystemTime(new Date(`2021-01-${day}T00:00:00`))

    expect(cronExpressionMatchesNow('* * 2-4 * *')).toBe(expected)
  })

  test.each([
    ['01', false],
    ['02', true],
    ['03', false],
    ['04', true],
    ['05', false],
  ])('2021-01-%s returns %s for * * 2,4 * *', (day, expected) => {
    vi.setSystemTime(new Date(`2021-01-${day}T00:00:00`))

    expect(cronExpressionMatchesNow('* * 2,4 * *')).toBe(expected)
  })

  test.each([
    ['01', true],
    ['02', false],
    ['03', true],
    ['04', false],
  ])('2021-01-%s returns %s for * * */2 * *', (day, expected) => {
    vi.setSystemTime(new Date(`2021-01-${day}T00:00:00`))

    expect(cronExpressionMatchesNow('* * */2 * *')).toBe(expected)
  })

  test.each([
    ['01', false],
    ['02', true],
    ['03', true],
    ['04', true],
    ['05', false],
    ['06', false],
  ])('2021-01-%s returns %s for * * 2-5/2,3 * *', (day, expected) => {
    vi.setSystemTime(new Date(`2021-01-${day}T00:00:00`))

    expect(cronExpressionMatchesNow('* * 2-5/2,3 * *')).toBe(expected)
  })

  it('works with L character', () => {
    vi.setSystemTime(new Date('2021-01-01T00:00:00'))

    expect(cronExpressionMatchesNow('* * L * *')).toBe(false)

    vi.setSystemTime(new Date('2021-01-31T00:00:00'))

    expect(cronExpressionMatchesNow('* * L * *')).toBe(true)

    vi.setSystemTime(new Date('2021-02-28T00:00:00'))

    expect(cronExpressionMatchesNow('* * L * *')).toBe(true)

    vi.setSystemTime(new Date('2021-01-30T00:00:00'))

    expect(cronExpressionMatchesNow('* * L-1 * *')).toBe(true)
  })

  test.each([
    ['01', false],
    ['02', true],
    ['03', true],
    ['04', true],
    ['05', false],
    ['06', false],
  ])('2021-%s-01 returns %s for * * * 2-5/2,3 *', (day, expected) => {
    vi.setSystemTime(new Date(`2021-${day}-01T00:00:00`))

    expect(cronExpressionMatchesNow('* * * 2-5/2,3 *')).toBe(expected)
  })

  test.each([
    ['01', false],
    ['02', true],
    ['03', true],
    ['04', true],
    ['05', false],
    ['06', false],
    ['07', false],
  ])('2023-01-%s returns %s for * * * * 2-5/2,3', (day, expected) => {
    vi.setSystemTime(new Date(`2023-01-${day}T00:00:00`))

    expect(cronExpressionMatchesNow('* * * * 2-5/2,3')).toBe(expected)
  })

  it('works with L for days of week', () => {
    vi.setSystemTime(new Date('2024-07-29T00:00:00'))

    expect(cronExpressionMatchesNow('* * * * 2L')).toBe(true)

    vi.setSystemTime(new Date('2024-07-22T00:00:00'))

    expect(cronExpressionMatchesNow('* * * * 2L')).toBe(false)
  })
})
