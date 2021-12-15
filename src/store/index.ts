import { makeAutoObservable, autorun, toJS, runInAction, reaction } from 'mobx'
import { generateTruancies, TruanciesFactory } from '../data'

import { days, Employee, EmployeeFactory, makeEmployees, Schedule } from '../data/employeeFactory'
import { DateStore } from './date.store'

class Store {
  dateStore
  truanciesFactory
  employeeFactory
  employeeCount
  plan: Employee[] = []
  fact: Employee[] = []
  data: any[] = []

  constructor(
    employeeFactory: EmployeeFactory,
    truanciesFactory: TruanciesFactory,
    employeeCount = 10
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.dateStore = DateStore
    this.employeeFactory = employeeFactory
    this.truanciesFactory = truanciesFactory
    this.employeeCount = employeeCount

    this.plan = this.employeeFactory(this.employeeCount)
    this.fact = this.truanciesFactory(JSON.parse(JSON.stringify(this.plan)))

    autorun(() => this.prepareData())
    reaction(() => this.dateStore.date, () => {
      // console.log('in reaction')
      this.prepareData()
    })
  }

  prepareData = async () => {
    const data: any[] = []

    const getFactData = (id: number): Employee => {
      const [employee] = this.fact.filter(employee => employee.id === id)
      return employee
    }

    const schduleOfSelectedDay = (employee: Employee): Schedule => {
      const [schedule] = employee.schedules.filter(day => day.day === this.dateStore.day)
      return schedule
    }

    this.plan.forEach(employee => {
      const factEmplyee = getFactData(employee.id)

      const planSchedule = schduleOfSelectedDay(employee)
      const factSchedule = schduleOfSelectedDay(factEmplyee)

      const obj = {
        id: employee.id,
        name: `${employee.id}: ${employee.name}`,
        role: employee.role,
        planTo: planSchedule.to,
        factTo: factSchedule.to,
        reason: factSchedule.truancyReason
      }
      data.push(obj)
    })

    runInAction(() => this.data = data)
  }
}

export const store = new Store(makeEmployees, generateTruancies)
