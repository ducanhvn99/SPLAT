import { Paper, Typography } from '@mui/material';
import React, { FC, ReactElement } from 'react';

type WidgetProps = {
    children: JSX.Element;
    size: {
        width: number | string;
        height: number | string;
    };
    title: string;
};

const Widget: FC<WidgetProps> = (props: WidgetProps): ReactElement => {

    return (
        <Paper 
        elevation={2} 
        sx={{ width: props.size.width, height: props.size.height, paddingLeft: 1, paddingRight: 1, paddingTop: 1 }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ textAlign: "center" }}>
                {props.title}
            </Typography>

            {props.children}
        </Paper>
    );
};

export default Widget;