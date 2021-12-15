import React from 'react'
import DateAdapter from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { TextField } from '@mui/material'
import { DateStore } from '../../store/date.store'
import { observer } from 'mobx-react-lite'


function DateSelect() {
  const { date, setDate } = DateStore
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        value={date}
        onChange={setDate}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
export default observer(DateSelect)