import React from 'react'
import { observer } from 'mobx-react-lite'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { CustomTooltip } from './CustomTooltip'
import { ChartData } from '../../store/chart.store'
import { Box } from '@mui/material'
import { FACT_TO, PLAN_TO } from '../../lexicon'

interface ChartProps {
  data: ChartData[]
}

export const Chart = observer(({ data }: ChartProps) => {

  return (
    <Box sx={{ borderRadius: 10, border: 1, height: '70vh' }} p={3} >
      <ResponsiveContainer>
        <BarChart data={data} style={{ marginLeft: '-1.3em' }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis id='left' type='number' domain={[9, 24]}  />
          <Tooltip content={<CustomTooltip />} />
          <Legend  />
          <ReferenceLine x={0} y={9} label='9:00' stroke="red" strokeDasharray="3 3"  />
          {/*
            Рабочий день начинается в 9,
            дублирующие столбцы сдвигают столбцы с данным вверх,
            чтобы отчет начинался не с 0 и чтобы можно было показывать случаи,
            когда сотрудник начал работу раньше положенного времени.
          */}
          <Bar name='' dataKey="planFrom" stackId='a' fill="rgba(130, 202, 157, .1)" />
          <Bar name={PLAN_TO} dataKey="planTo" stackId='a' fill="rgba(130, 202, 157, 1)" />
          <Bar name='' dataKey="factFrom" stackId='b' fill="rgba(255,97,99, .1)" />
          <Bar name={FACT_TO} dataKey="factTo" stackId='b' fill="rgba(255,97,99, 1)" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
})