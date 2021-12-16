import React from 'react'
import { observer } from 'mobx-react-lite'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import DateAdapter from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { TextField } from '@mui/material'
import { DateStore } from '../../store/date.store'


function DateSelect() {
  const { date, setDate } = DateStore
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        label={format(date, 'PPP', { locale: ru })}
        value={date}
        onChange={setDate}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
export default observer(DateSelect)