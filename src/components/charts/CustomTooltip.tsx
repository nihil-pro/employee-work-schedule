import React from 'react'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import AlertTitle from '@mui/material/AlertTitle'
import red from '@mui/material/colors/red'
import { ChartData } from '../../store/chart.store'
import { Employee, Schedule } from '../../factories/employee.factory'
import { RusOfWeek } from '../../lexicon'

export const CustomTooltip = observer(({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null

  const payloadData: ChartData = toJS(payload[0].payload)
  const employee: Employee = payloadData.employee

  const scheduleText = (schedule: Schedule): string => {
    const day = RusOfWeek[schedule.day]
    const description = schedule.from !== 'weekend' ? `${schedule.from}:00 – ${schedule.to}:00` : 'Выходной'
    return `${day}: ${description}`
  }

  return (
    <Card sx={{ maxWidth: 350 }} >
      <CardHeader
        avatar={ <Avatar sx={{ bgcolor: red[500] }}> {employee.id} </Avatar> }
        title={employee.name}
        subheader={`${employee.role} в «${employee.place}»`}
      />

      <CardContent>
        {payloadData.reason && payloadData.event && (
          <Stack>
            <Alert severity='error'>
              <AlertTitle>{payloadData.reason}</AlertTitle>
              {payloadData.event}
            </Alert>
          </Stack>
        )}

        <List dense={true}>
          {employee.schedules.map((schedule, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={scheduleText(schedule)}
              />
            </ListItem>
          ))}
        </List>

      </CardContent>
    </Card>
  )
})