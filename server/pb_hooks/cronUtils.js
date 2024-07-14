//TODO: Support '#' for week days?

function cronExpressionMatchesNow(cronExpr) {
  const now = new Date()
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpr.split(' ')

  // We only support exact minute and hour for now
  if (minute !== '*' && parseInt(minute, 10) !== now.getMinutes()) {
    return false
  }
  if (hour !== '*' && parseInt(hour, 10) !== now.getHours()) {
    return false
  }

  /**
   *
   * @param {string} value
   * @returns
   */
  const getDateIntValues = (value) => {
    if (value === '*') {
      return [1]
    }
    if (value[0] === 'L') {
      const int = parseInt(value.slice(1), 10) || 0
      const today = new Date()
      return [
        new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() + int,
      ]
    }
    const [start, end] = value.split('-')
    return [parseInt(start, 10), parseInt(end, 10) || undefined]
  }

  const dateList = dayOfMonth.split(',')
  const dateValid = dateList.some((date) => {
    const [range, interval] = date.split('/')
    const [startDate, endDate] = getDateIntValues(range)
    if (
      interval &&
      (now.getDate() - startDate) % parseInt(interval, 10) !== 0
    ) {
      return false
    }
    if (endDate) {
      if (startDate <= now.getDate() && now.getDate() <= endDate) {
        return true
      }
    }
    return range === '*' || startDate === now.getDate()
  })
  if (!dateValid) {
    return false
  }

  const monthList = month.split(',')
  const monthValid = monthList.some((month) => {
    const thisMonth = now.getMonth() + 1
    const [range, interval] = month.split('/')
    const [start, end] = range.split('-')
    const startMonth = start === '*' ? 1 : parseInt(start, 10)
    if (interval && (thisMonth - startMonth) % parseInt(interval, 10) !== 0) {
      return false
    }
    if (end) {
      const endMonth = parseInt(end, 10)
      return startMonth <= thisMonth && thisMonth <= endMonth
    }
    return start === '*' || parseInt(month, 10) === thisMonth
  })
  if (!monthValid) {
    return false
  }

  const dayOfWeekList = dayOfWeek.split(',')
  const dayOfWeekValid = dayOfWeekList.some((day) => {
    const thisDay = now.getDay() + 1
    if (day.includes('L')) {
      const int = parseInt(day) - 1
      const lastWeekDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      lastWeekDay.setDate(
        lastWeekDay.getDate() - ((lastWeekDay.getDay() + 7 - int) % 7)
      )
      return lastWeekDay.getDate() === now.getDate()
    }
    const [range, interval] = day.split('/')
    const [start, end] = range.split('-')
    const startDay = start === '*' ? 1 : parseInt(start, 10)
    if (interval && (thisDay - startDay) % parseInt(interval, 10) !== 0) {
      return false
    }
    if (end) {
      const endDay = parseInt(end, 10)
      return startDay <= thisDay && thisDay <= endDay
    }
    return day === '*' || parseInt(day, 10) === thisDay
  })
  if (!dayOfWeekValid) {
    return false
  }

  return true
}

module.exports = {
  cronExpressionMatchesNow,
}
