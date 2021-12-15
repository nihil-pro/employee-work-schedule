import { toJS } from 'mobx'
import { days, Employee, Schedule } from './employeeFactory'
import { getRandom } from './utils'

const WHO = ['Кошка', 'Мышка', 'Собака', 'Няня', 'Бабушка'] as const
const HOW = ['сильно', 'немного', 'чуть-чуть'] as const
const WHAT = ['заболела', 'объелась', 'напакостила', 'разбила вазу', 'не давала спать', 'шумела'] as const


export type TruanciesFactory = (employees: Employee[]) => Employee[]


export function generateTruancies(employees: Employee[]): Employee[] {
  const copy: Employee[] = JSON.parse(JSON.stringify(toJS(employees)))
  return copy.map((employee, index) => {
    if (index%2 !== 0) {
      return generatуLeavingsWork(employee)
    } else {
      return employee
    }
  })
}

function generatуLeavingsWork(employee: Employee) {
  const { schedules } = employee

  const employeeWorkDays = toJS(schedules)
    .filter(schedule => typeof schedule.from === 'number')
    .filter(schedule => typeof schedule.to === 'number')

  const employeeWeekend = schedules
    .filter(schedule => typeof schedule.from !== 'number')
    .filter(schedule => typeof schedule.to !== 'number')

  const result: Schedule[] = []
  employeeWorkDays.forEach(day => {
    const preposition = generatePreposition()
    const withPreposition = {
      ...day,
      to: getRandom(17, 9),
      truancyReason: preposition
    }

    result.push(withPreposition)
  })

  employee.schedules = result.concat(employeeWeekend)

  return employee
}

export type Preposition = `${typeof WHO[number]} ${typeof HOW[number]} ${typeof WHAT[number]}.`
function generatePreposition(): Preposition {
  const who = WHO[getRandom(WHO.length)]
  const how = HOW[getRandom(HOW.length)]
  const what  = WHAT[getRandom(WHAT.length)]

  return `${who} ${how} ${what}.` as Preposition
}