import { ChangeEvent } from 'react'
import { makeAutoObservable, autorun, runInAction, reaction } from 'mobx'
import { DateStore } from './date.store'
import { Employee, EmployeeFactory, makeEmployees, Schedule } from '../factories/employee.factory'
import { generateActivities, ActivitiesFactory } from '../factories/activity.factory'
import { WEEKEND } from '../factories/constants'

export interface ChartData {
  name: string,
  employee: Employee
  planFrom: number,
  planTo: number,
  factFrom: number,
  factTo: number,
  reason?: string,
  event?: string
}

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
    truanciesFactory: ActivitiesFactory,
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
      this.prepareData()
    })
  }

  changeEmployeeCount(event: ChangeEvent<HTMLInputElement>) {
    runInAction(() => {
      this.employeeCount = +event.currentTarget.value || this.employeeCount
      this.plan = this.employeeFactory(this.employeeCount)
      this.fact = this.truanciesFactory(JSON.parse(JSON.stringify(this.plan)))
      this.prepareData()
    })
  }

  prepareData = () => {
    const data: ChartData[] = []

    this.plan.forEach(employee => {
      const factEmployee = this.getFactData(employee.id)

      const planSchedule = this.scheduleOfSelectedDay(employee)
      const factSchedule = this.scheduleOfSelectedDay(factEmployee)

      const schedules = this.prepareSchedules(planSchedule, factSchedule)

      const obj: ChartData = {
        name: employee.name,
        employee: employee,
        ...schedules
      }
      data.push(obj)
    })

    runInAction(() => this.data = data)
  }



  // utils
  private getFactData = (id: number): Employee => {
    const [employee] = this.fact.filter(employee => employee.id === id)
    return employee
  }

  private scheduleOfSelectedDay = (employee: Employee): Schedule => {
    const [schedule] = employee.schedules.filter(day => day.day === this.dateStore.day)
    return schedule
  }

  private prepareSchedules = (planSchedule: Schedule, factSchedule: Schedule) => {
    // if weekend
    if (
      planSchedule.from === WEEKEND
      && factSchedule.from === WEEKEND
      && planSchedule.to === WEEKEND
      && factSchedule.to === WEEKEND
    )  {
      return {
        planFrom: 0,
        planTo: 0,
        factFrom: 0,
        factTo: 0
      }
    } else {
      const data: any = {
        planFrom: planSchedule.from as number,
        planTo: +planSchedule.to - +planSchedule.from,
        factFrom: factSchedule.from as number,
        factTo: +factSchedule.to - +factSchedule.from,
        reason: `${factSchedule.reason}`
      }

      if (planSchedule.from > factSchedule.from) {
        data.event = `?????????????????? ?????????? ???????????? ???????????? ???? ${(+planSchedule.from)-(+factSchedule.from)} ??????.`
      } else if (planSchedule.from < factSchedule.from) {
        data.event = `?????????????????? ?????????????? ???? ???????????? ???? ${(+planSchedule.from)-(+factSchedule.from)} ??????.`
      } else if (planSchedule.to > factSchedule.to) {
        data.event = `?????????????????? ???????? ?? ???????????? ???????????? ???? ${(+planSchedule.to)-(+factSchedule.to)} ??????.`
      } else if (planSchedule.to < factSchedule.to) {
        data.event = `?????????????????? ?????????????????????? ${(+factSchedule.to)-(+planSchedule.to)} ??????.`
      }

      return data
    }
  }
}

export const store = new Store(makeEmployees, generateActivities)
