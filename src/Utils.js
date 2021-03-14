export const minuteToTimeString = (minutes) => {
  const hours = minutes / 60
  const roundedHours = `${Math.floor(hours)}`.padStart(2, '0')
  const remainingMinutes = `${(minutes - roundedHours * 60)}`.padStart(2, '0')

  return `${roundedHours}:${remainingMinutes}`
}

export const dateToTimeString = (date) => {
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')

  return `${hours}:${minutes}`
}