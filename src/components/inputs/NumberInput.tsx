import React, { ChangeEvent } from 'react'
import { observer } from 'mobx-react-lite'
import TextField from '@mui/material/TextField'

interface NumberInputProps {
  value: number,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function NumberInput({ value, onChange }: NumberInputProps) {
  return (
    <TextField
      onChange={onChange}
      value={value}
      type='number'
      label='Количество сотрудников'
      inputProps={{ min: 4, max: 25 }}
    />
  )
}

export default observer(NumberInput)