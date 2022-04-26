import { useEffect, useState } from 'react'
import { getMowerSchedule } from '../../domain/MowerScheduleService'

export const useSchedule = () => {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    getMowerSchedule().then(setSchedule)
  }, [])

  return [schedule]
}