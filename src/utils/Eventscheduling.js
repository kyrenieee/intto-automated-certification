export const WHOLE_DAY_CUTOFF = "12:00"; // 12:00 PM
export const WHOLE_DAY_CUTOFF_LABEL = "12:00 PM";

// Office hour boundaries
export const OFFICE_HOURS_START = "08:00";
export const OFFICE_HOURS_END = "17:00";

export function getDurationType(endTime) {
  if (!endTime) return "half";
  return endTime > WHOLE_DAY_CUTOFF ? "whole" : "half";
}

export function hasWholeDayConflict(events, dateString) {
  if (!dateString || !Array.isArray(events)) return false;
  return events.some((e) => {
    if (e.date !== dateString) return false;
    const type = e.durationType || getDurationType(e.endTime || e.time);
    return type === "whole";
  });
}

// new helper to validate if times fall strictly within 8:00 AM to 5:00 PM
export function isWithinOfficeHours(startTime, endTime) {
  if (!startTime || !endTime) return true;
  return (
    startTime >= OFFICE_HOURS_START &&
    startTime <= OFFICE_HOURS_END &&
    endTime >= OFFICE_HOURS_START &&
    endTime <= OFFICE_HOURS_END
  );
}