
export const WHOLE_DAY_CUTOFF = '17:00' // 5:00 PM
export const WHOLE_DAY_CUTOFF_LABEL = '5:00 PM'


export function getDurationType(endTime) {
  if (!endTime) return 'half'
  return endTime > WHOLE_DAY_CUTOFF ? 'whole' : 'half'
}

export function hasWholeDayConflict(events, dateString) {
  if (!dateString || !Array.isArray(events)) return false
  return events.some((e) => {
    if (e.date !== dateString) return false
    const type = e.durationType || getDurationType(e.endTime || e.time)
    return type === 'whole'
  })
}