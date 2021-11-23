import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { baseRequest } from '../../../services/api/genericRequest';
import {TotalReport} from '../../../models/TotalReport';
import axios from 'axios';
import {ReportDialogProps} from '../pages/Reports';

const TotalReportTest: TotalReport = {
    foodWeight:200,
    disbursements:20,
    peopleImpacted:22,
    recurringVisits:300,
    individualVisits:30,
}

interface TotalReportDialogProps {
    open: ReportDialogProps["open"];
    onClose: ReportDialogProps["onClose"];
    startDateValue: ReportDialogProps["startDateValue"];
    endDateValue: ReportDialogProps["endDateValue"];

}
const TotalReportDialog: FC<TotalReportDialogProps> = (props:TotalReportDialogProps) : ReactElement => {

    const [totalReport, setTotalReport] = useState<TotalReport>();

    const getTotalReport = async () => {
        try {
            let res = await axios.get<TotalReport> ('/totalReport');
            setTotalReport(res.data);
        } catch(err) {

        }
    };

    React.useEffect(() => {
        getTotalReport();
    }, [])

    

    return(
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>Total Report</DialogTitle>
            <DialogContent>
            <div>
            <TableContainer component={Paper}>
                    <Table sx = {{ maxWidth: 700, maxHeight: 600, alignItems: 'left'}} aria-label="total report">
                        <TableHead >
                            <TableRow >
                                <TableCell align="left">Total</TableCell>
                                <TableCell align="right">Count</TableCell>
                            </TableRow>
                        </TableHead>
                        
                    </Table>
                    <TableBody>
                    <TableRow sx={{alignItems: 'right'}}>
                                <TableCell> Food Weight:</TableCell>
                                <TableCell> {totalReport?.foodWeight} </TableCell>                       
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Food Disbursements: </TableCell>
                                <TableCell> {totalReport?.disbursements} </TableCell>
                                
                            </TableRow>

                            <TableRow>
                            <TableCell> People Impacted: </TableCell>
                            <TableCell> {totalReport?.peopleImpacted} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>Recurring Visits: </TableCell>
                                <TableCell> {totalReport?.recurringVisits} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Individual Visits: </TableCell>
                                <TableCell> {totalReport?.individualVisits} </TableCell>
                            
                            </TableRow>
                    </TableBody>
                </TableContainer>
        </div>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Closed</Button>
            </DialogActions>
        </Dialog>
        
        </>
    )
};

export default TotalReportDialog; 