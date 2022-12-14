import { Grid, Stack } from '@mui/material';
import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';
import HoursDaySelector from '../subcomponents/hours/HoursDaySelector';
import HoursTable from '../subcomponents/hours/HoursTable';

interface HoursProps extends IStaffChild {
    
}

const Hours: FC<HoursProps> = (props: HoursProps): ReactElement => {



    return (
        <>
        <Grid container>
            <Grid item xs={4} />
            <Grid item xs={5}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <HoursTable />
                <HoursDaySelector />
            </Stack>
            </Grid>
            <Grid item xs={3} />
        </Grid>
        </>
    )
};

export default Hours;
