/// <reference path="..\pb_data\types.d.ts" />

/**
 * Check if a chore is scheduled to be reset right now
 * @param {models.Record} chore
 */
function choreShouldReset(chore) {
  const getWeeksBetween = (firstDate, secondDate) => {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay) / 7
    )
  }

  const getMonthsBetween = (firstDate, secondDate) => {
    return Math.abs(
      (firstDate.getFullYear() - secondDate.getFullYear()) * 12 +
        firstDate.getMonth() -
        secondDate.getMonth()
    )
  }

  try {
    console.log('Checking chore:', chore.get('name'))
    const today = new Date()
    const thisWeekSunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    )
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    )

    const startOn = chore.get('start_on').toString().replace(' ', 'T')
    const startOnDate = new Date(startOn)

    const startOnWeekSunday = new Date(
      startOnDate.getFullYear(),
      startOnDate.getMonth(),
      startOnDate.getDate() - startOnDate.getDay()
    )
    const repeatInterval = chore.get('repeat_interval')
    const repeatUnit = chore.get('repeat_unit')
    const repeatSelections = chore.get('repeat_selections')
    const repeatWeekdays = chore.get('repeat_weekdays')
    const thisDay = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][today.getDay()]

    const shouldRepeatWeekCheck =
      repeatUnit === 'week' &&
      getWeeksBetween(thisWeekSunday, startOnWeekSunday) % repeatInterval ===
        0 &&
      repeatWeekdays.includes(thisDay)

    const onMonthInterval =
      getMonthsBetween(today, startOnDate) % repeatInterval === 0
    const inRepeatSelections = repeatSelections.includes(
      today.getDate().toString()
    )

    const timeMatches =
      today.getHours() === startOnDate.getHours() &&
      today.getMinutes() === startOnDate.getMinutes()

    const inRepeatSelectionsEndOfMonth = repeatSelections.includes(
      `${today.getDate() - lastDayOfMonth.getDate() - 1}`
    )

    const shouldRepeatMonthCheck =
      repeatUnit === 'month' &&
      onMonthInterval &&
      (inRepeatSelections || inRepeatSelectionsEndOfMonth)

    return timeMatches && (shouldRepeatMonthCheck || shouldRepeatWeekCheck)
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  choreShouldReset,
}
