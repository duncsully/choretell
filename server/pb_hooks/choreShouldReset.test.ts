import { choreShouldReset } from './choreShouldReset'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
/// <reference path="..\pb_data\types.d.ts" />

class MockChore {
  constructor(
    public start_on: string,
    public repeat_interval: number,
    public repeat_unit: string,
    public repeat_weekdays: string[],
    public repeat_selections: string[],
    public count_from_completion: boolean
  ) {}

  name = 'MockChore'

  get(key: keyof MockChore) {
    return this[key]
  }
}

const makeChore = (
  start_on,
  repeat_interval,
  repeat_unit,
  repeat_weekdays,
  repeat_selections,
  count_from_completion = false
) =>
  new MockChore(
    start_on,
    repeat_interval,
    repeat_unit,
    repeat_weekdays,
    repeat_selections,
    count_from_completion
  ) as unknown as models.Record

describe('choreShouldReset', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })
  afterAll(() => {
    vi.useRealTimers()
  })

  it('returns true if weekday is in list on the correct interval', () => {
    vi.setSystemTime('2024-07-22T08:00:00.000Z')

    // Correct interval and weekday
    const chore1 = makeChore('2024-07-01T08:00:00.000Z', 1, 'week', ['Mo'], [])
    expect(choreShouldReset(chore1)).toBe(true)

    // Correct weekday but wrong interval
    const chore2 = makeChore('2024-07-01T08:00:00.000Z', 2, 'week', ['Mo'], [])
    expect(choreShouldReset(chore2)).toBe(false)

    // Correct interval but wrong weekday
    const chore3 = makeChore('2024-07-01T08:00:00.000Z', 1, 'week', ['Tu'], [])
    expect(choreShouldReset(chore3)).toBe(false)

    // Correct interval and weekday
    const chore4 = makeChore('2024-07-01T08:00:00.000Z', 3, 'week', ['Mo'], [])
    expect(choreShouldReset(chore4)).toBe(true)
  })

  it('returns true if date is in list on the correct interval', () => {
    vi.setSystemTime('2024-10-30T08:00:00.000Z')

    // Correct interval and date
    const chore1 = makeChore('2024-07-01T08:00:00.000Z', 1, 'month', [], ['30'])
    expect(choreShouldReset(chore1)).toBe(true)

    // Correct interval but wrong date
    const chore2 = makeChore('2024-07-01T08:00:00.000Z', 1, 'month', [], ['1'])
    expect(choreShouldReset(chore2)).toBe(false)

    // Correct date but wrong interval
    const chore3 = makeChore('2024-07-01T08:00:00.000Z', 2, 'month', [], ['30'])
    expect(choreShouldReset(chore3)).toBe(false)

    // Correct date and interval
    const chore4 = makeChore('2024-07-01T08:00:00.000Z', 3, 'month', [], ['30'])
    expect(choreShouldReset(chore4)).toBe(true)

    // Correct interval but wrong relative date from end of month
    const chore5 = makeChore('2024-07-01T08:00:00.000Z', 1, 'month', [], ['-1'])
    expect(choreShouldReset(chore5)).toBe(false)

    // Correct interval and relative date from end of month
    const chore6 = makeChore('2024-07-01T08:00:00.000Z', 1, 'month', [], ['-2'])
    expect(choreShouldReset(chore6)).toBe(true)
  })

  it('returns true if date is on correct interval', () => {
    vi.setSystemTime('2024-07-22T08:00:00.000Z')

    const chore1 = makeChore('2024-07-01T08:00:00.000Z', 1, 'day', [], [])
    expect(choreShouldReset(chore1)).toBe(true)

    const chore2 = makeChore('2024-07-01T08:00:00.000Z', 2, 'day', [], [])
    expect(choreShouldReset(chore2)).toBe(false)

    const lastCompletion3 = new Date('2024-07-20T08:00:00.000Z')
    const chore3 = makeChore('2024-07-01T08:00:00.000Z', 2, 'day', [], [], true)
    expect(choreShouldReset(chore3, lastCompletion3)).toBe(true)

    const lastCompletion4 = new Date('2024-07-21T08:00:00.000Z')
    const chore4 = makeChore('2024-07-01T08:00:00.000Z', 2, 'day', [], [], true)
    expect(choreShouldReset(chore4, lastCompletion4)).toBe(false)
  })
})
