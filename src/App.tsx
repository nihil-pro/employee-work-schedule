import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { Employee } from './data/employeeFactory'
import { store } from './store'
import DateSelect from './components/dates/DateSelect'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'

function App() {
  const { data, plan } = store

  if (!toJS(data)) return null


  const getEmployee = (id: number): Employee => {
    const [employee] = toJS(plan).filter(employee => employee.id === id)
    return employee
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const payloadData = toJS(payload[0].payload)
      const employee = getEmployee(payloadData.id)

      return (
        <Card elevation={3}>
          <CardContent>
            <Stack direction="column" spacing={2} sx={{ background: '#fff' }}>
              <Stack>
                <Typography variant='h6'>
                  {employee.name}
                </Typography>

                <Typography>
                  Роль: {employee.role}<br/>
                  Место: {employee.place}
                </Typography>
              </Stack>

              <Stack>
                <Typography variant='caption'>
                  График работы: <br/>
                  {employee.schedules.map((schedule, index) => (
                    <React.Fragment key={index}>
                      {schedule.from === 'weekend' ? (
                        <span>
                          {schedule.day}: Выходной
                        </span>
                      ) : (
                        <span>
                          {schedule.day} до {schedule.to}
                        </span>
                      )}
                      <br/>
                    </React.Fragment>
                  ))}
                </Typography>
              </Stack>

              {payloadData.reason && (
                <Stack>
                  <Alert severity='error'>
                    {payloadData.reason}
                  </Alert>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      )
    }

    return null;
  }

  return (
    <div className="App">
      <DateSelect />
      <BarChart width={1000} height={500} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="planTo" fill="rgba(130, 202, 157, .5)" />
        <Bar dataKey="factTo" fill="rgba(255,97,99, .5)" />
      </BarChart>
    </div>
  )
}

export default observer(App)
