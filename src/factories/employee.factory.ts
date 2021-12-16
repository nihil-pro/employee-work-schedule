import { getRandom } from './utils'
import {
  days,
  MONDAY,
  names,
  places,
  roles,
  SATURDAY,
  WEDNESDAY,
  WEEKEND,
  WORK_DAY_END,
  WORK_DAY_START
} from './constants'

export interface Schedule {
  day: typeof days[number],
  from: number | typeof WEEKEND,
  to: number | typeof WEEKEND,
  reason?: string
}

export interface Employee {
  id: number,
  name: typeof names[number],
  role: typeof roles[number],
  place: typeof places[number],
  schedules: Schedule[]
}

/**
 ** Creates and return an array of random employees
 * */
export type EmployeeFactory = (count: number) => Employee[]
export function makeEmployees(count: number): Array<Employee> {
  const result: Employee[] = []

  for (let i = 0; i < count; i++) {
    result.push(makeEmployee())
  }

  return result
}


/**
 * Generate a random employee
 * */
function makeEmployee(): Employee {
  const workingDays = days.slice(MONDAY, SATURDAY)

  const place = places[getRandom(places.length)]
  const role = roles[getRandom(roles.length)]
  const name = names[getRandom(names.length)]

  let schedules: Array<Schedule> = []
  switch (role) {
    case 'Охранник':
      schedules = makeSchedule(days.slice())
      break
    case 'Официант' || 'Повар':
      const firstHalfOfWeek = workingDays.slice(MONDAY, WEDNESDAY)
      const secondHalfOfWeek = workingDays.slice(-WEDNESDAY)

      const firstShift = firstHalfOfWeek[getRandom(firstHalfOfWeek.length)]
      const secondShift = secondHalfOfWeek[getRandom(secondHalfOfWeek.length)]

      schedules = makeSchedule([firstShift, secondShift])
      break
    default:
      schedules = makeSchedule(workingDays)
  }

  return {
    id: ids.getId(),
    name: name,
    place: place,
    schedules: schedules,
    role: role
  }
}

/** Generate schedule for employee */
function makeSchedule(workingDays: string[]) {
  const schedules: Schedule[] = []

  days.forEach(day => {
    if (workingDays.includes(day)) {
      schedules.push({
        day: day,
        from: WORK_DAY_START,
        to: WORK_DAY_END
      })
    } else {
      schedules.push({
        day: day,
        from: WEEKEND,
        to: WEEKEND
      })
    }
  })

  return schedules
}


/** Generate unique id */
class Ids {
  private id: number = 0

  getId() {
    ++this.id
    return this.id
  }
}

const ids = new Ids()


