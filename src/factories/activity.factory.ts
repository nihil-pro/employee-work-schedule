import { toJS } from 'mobx'
import { getRandom } from './utils'
import { Employee, Schedule } from './employee.factory'
import {
  HOW,
  WHAT,
  WHO,
  MOTIVE_HOW,
  MOTIVE_WHAT,
  MOTIVE_WHO,
  WORK_DAY_END,
  WORK_DAY_START
} from './constants'


export type ActivitiesFactory = (employees: Employee[]) => Employee[]
type _Event = 'leftEarlier' | 'cameEarlier' | 'cameLater' | 'leftLater'

/**
 * Generate random employees activities
 * */
export function generateActivities(employees: Employee[]): Employee[] {
  if (employees.length < 4) return employees

  function loop(indexes?: number[]): number {
    const result = getRandom(employees.length)
    if (indexes?.includes(result)) return loop(indexes)
    return result
  }

  const leftEarlier = loop()
  const cameEarlier = loop([leftEarlier])
  const cameLater = loop([leftEarlier, cameEarlier])
  const leftLater = loop([leftEarlier, cameEarlier, cameLater])

  return toJS(employees).map((employee, index) => {
    switch (index) {
      case leftEarlier:
        return generateActivity(employee, 'leftEarlier')
      case cameEarlier:
        return generateActivity(employee, 'cameEarlier')
      case cameLater:
        return generateActivity(employee, 'cameLater')
      case leftLater:
        return generateActivity(employee, 'leftLater')
      default:
        return employee
    }
  })
}


function generateActivity(employee: Employee, event?: _Event) {
  const { schedules } = employee

  const employeeWorkDays = toJS(schedules)
    .filter(schedule => typeof schedule.from === 'number')
    .filter(schedule => typeof schedule.to === 'number')

  const employeeWeekend = schedules
    .filter(schedule => typeof schedule.from !== 'number')
    .filter(schedule => typeof schedule.to !== 'number')

  const result: Schedule[] = []
  employeeWorkDays.forEach((day) => {
    if (event) {
      const _event = generateEvent(event)
      const res = {
        ...day,
        ..._event
      }
      result.push(res)
    } else {
      result.push(day)
    }
  })

  employee.schedules = result.concat(employeeWeekend)

  return employee
}

function generateEvent(event: _Event) {
  switch (event) {
    case 'cameEarlier':
      return {
        from: getRandom(WORK_DAY_START, 6),
        reason: generatePreposition(MOTIVE_WHO, MOTIVE_HOW, MOTIVE_WHAT)
      }
    case 'cameLater':
      return {
        to: getRandom(WORK_DAY_END, WORK_DAY_START + 2) ,
        reason: generatePreposition(WHO, HOW, WHAT)
      }
    case 'leftEarlier':
      return {
        to: getRandom(WORK_DAY_END - 1, 12),
        reason: generatePreposition(WHO, HOW, WHAT)
      }
    case 'leftLater':
      return {
        to: getRandom(23, WORK_DAY_END),
        reason: generatePreposition(MOTIVE_WHO, MOTIVE_HOW, MOTIVE_WHAT)
      }
  }
}

type Data = typeof WHO[number]
  & typeof HOW[number]
  & typeof WHAT[number]
  & typeof MOTIVE_WHO[number]
  & typeof MOTIVE_WHO[number]
  & typeof MOTIVE_WHO[number]
function generatePreposition(who: Data[], how: Data[], what: Data[] ): string {
  return `${who[getRandom(who.length)]} ${how[getRandom(how.length)]} ${what[getRandom(what.length)]}.` as string
}