import React from 'react'
import { observer } from 'mobx-react-lite'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DateSelect from './components/dates/DateSelect'
import { Chart } from './components/charts/Chart'
import NumberInput from './components/inputs/NumberInput'
import { store } from './store/chart.store'
import { MAIN_PAGE_TITLE } from './lexicon'

function App() {
  const { data, changeEmployeeCount, employeeCount } = store

  return (
    <Grid container spacing={4} p={4} direction='column'>
      <Grid item>
        <Typography variant='h4' component='h1'>
          {MAIN_PAGE_TITLE}
        </Typography>
      </Grid>

      <Grid item>
        <Stack direction='row' spacing={3}>
          <Stack>
            <DateSelect />
          </Stack>

          <Stack>
            <NumberInput
              value={employeeCount}
              onChange={changeEmployeeCount}
            />
          </Stack>
        </Stack>
      </Grid>

      <Grid item>
        <Chart data={data} />
      </Grid>

    </Grid>
  )
}

export default observer(App)
