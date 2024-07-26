import { type ChoresRepeatSelectionsOptions } from '../pocketbase-types'

const suffixNumber = (number: number) => {
  if (number % 10 === 1 && number !== 11) {
    return `${number}st`
  }
  if (number % 10 === 2 && number !== 12) {
    return `${number}nd`
  }
  if (number % 10 === 3 && number !== 13) {
    return `${number}rd`
  }
  return `${number}th`
}

export const formatDate = (date: ChoresRepeatSelectionsOptions) => {
  const number = +date
  if (number === -1) {
    return 'Last'
  }
  if (number < 0) {
    return `${suffixNumber(-number)} to last`
  }
  return suffixNumber(number)
}
