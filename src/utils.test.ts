import { it, describe, expect } from 'vitest'
import { formatDate } from './utils'
import { ChoresRepeatSelectionsOptions } from '../pocketbase-types'

describe('utils', () => {
  describe('formatDate', () => {
    it('should return the correct date suffix', () => {
      expect(formatDate(ChoresRepeatSelectionsOptions.E1)).toBe('1st')
      expect(formatDate(ChoresRepeatSelectionsOptions.E2)).toBe('2nd')
      expect(formatDate(ChoresRepeatSelectionsOptions.E3)).toBe('3rd')
      expect(formatDate(ChoresRepeatSelectionsOptions.E4)).toBe('4th')
      expect(formatDate(ChoresRepeatSelectionsOptions.E11)).toBe('11th')
      expect(formatDate(ChoresRepeatSelectionsOptions.E12)).toBe('12th')
      expect(formatDate(ChoresRepeatSelectionsOptions.E13)).toBe('13th')
      expect(formatDate(ChoresRepeatSelectionsOptions.E14)).toBe('14th')
      expect(formatDate(ChoresRepeatSelectionsOptions.E21)).toBe('21st')
      expect(formatDate(ChoresRepeatSelectionsOptions.E22)).toBe('22nd')
      expect(formatDate(ChoresRepeatSelectionsOptions.E23)).toBe('23rd')
      expect(formatDate(ChoresRepeatSelectionsOptions.E24)).toBe('24th')
    })

    it('should return "Last" for -1', () => {
      expect(formatDate(ChoresRepeatSelectionsOptions['E-1'])).toBe('Last')
    })

    it('should return "nth to last" for negative numbers', () => {
      expect(formatDate(ChoresRepeatSelectionsOptions['E-2'])).toBe(
        '2nd to last'
      )
      expect(formatDate(ChoresRepeatSelectionsOptions['E-3'])).toBe(
        '3rd to last'
      )
      expect(formatDate(ChoresRepeatSelectionsOptions['E-4'])).toBe(
        '4th to last'
      )
    })
  })
})
