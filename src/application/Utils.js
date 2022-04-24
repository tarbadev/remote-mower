export const minuteToTimeString = (minutes) => {
  const hours = minutes / 60
  const roundedHours = `${Math.floor(hours)}`.padStart(2, '0')
  const remainingMinutes = `${(minutes - roundedHours * 60)}`.padStart(2, '0')

  return `${roundedHours}:${remainingMinutes}`
}