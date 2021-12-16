import { makeAutoObservable, runInAction } from 'mobx'
import { format } from 'date-fns'
import { days } from '../factories/constants'

class _DateStore {
  date: Date
  day: typeof days[number]
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.day = format(new Date(), 'EEEE') as typeof days[number]
    this.date = new Date()
  }

  setDate(date: Date | null) {
    if (date) {
      const day = format(date, 'EEEE') as typeof days[number]
      console.log(day)
      runInAction(() => {
        this.date = date
        this.day = format(date, 'EEEE') as typeof days[number]
      })
    }
  }
}

export const DateStore = new _DateStore()