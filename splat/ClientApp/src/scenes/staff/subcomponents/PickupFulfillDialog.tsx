import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { PickupStatus } from '../../../models/Pickup';
import { IPickupDialogProps } from '../pages/Pickups';

interface PickupFulfillDialogProps extends IPickupDialogProps {

};

const validationSchema = yup.object({
    weight: yup
    .number()
    .positive("Value must be positive")
    .required("Required"),
});

const PickupFulfillDialog: FC<PickupFulfillDialogProps> = (props: PickupFulfillDialogProps): ReactElement => {

    const initialValues = {
        weight: 0,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await handleFulfill(props.selectedPickup?.id, PickupStatus.WAITING, values.weight);
        }
    })

    const handleFulfill = async (id: string | undefined | null, newStatus: PickupStatus, newWeight: number) => {
        if(id)
        try {
            await axios.patch(`/pickups/${props.selectedPickup?.id}`,
                [
                    {
                        op: "add",
                        path: "/weight",
                        value: newWeight,
                    },
                    {
                        op: "add",
                        path: "/pickupstatus",
                        value: newStatus,
                    },
                ], { headers: { 'Content-Type': 'application/json-patch+json' }});
        } catch (err) {

        }

        props.onClose();
    };

    const handlePickup = async () => {
        if(props.selectedPickup?.id)
        try {
            await axios.patch(`/pickups/${props.selectedPickup?.id}`,
                [
                    {
                        op: "add",
                        path: "/pickupstatus",
                        value: PickupStatus.DISBURSED,
                    },
                    {
                        op: "add",
                        path: "/pickuptime",
                        value: new Date().toISOString(),
                    }
                ], { headers: { 'Content-Type': 'application/json-patch+json' }});
        } catch(err) {

        }

        props.onClose();
    }

    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        >
        {(props.selectedPickup?.pickupStatus === PickupStatus.PENDING) ? (
            <>
            <DialogTitle>
                Fulfill Request
            </DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} align="center">Items in request</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                            </TableRow>
                            {props.selectedPickup?.itemRequests.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.item.name}</TableCell>
                                    <TableCell>{row.category?.name}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <FormikProvider value={formik}>
                <Form>
                    <TextField
                    name="weight"
                    label="Weight"
                    variant="outlined"
                    type="number"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    helperText={formik.touched.weight && formik.errors.weight}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">lb</InputAdornment>,
                    }}
                    sx={{ marginTop: 1 }}
                    />
                </Form>
                </FormikProvider>
            </DialogContent>
            <DialogActions sx={{ margin: 1 }}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => formik.submitForm()} color="primary">
                    Fulfill
                </Button>
            </DialogActions>
            </>
        ) : (
            <>
            <DialogTitle>
                Student Picked Up
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Has the student picked up the order?
                </Typography>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Cancel</Button>
                <Button variant="contained" onClick={() => handlePickup()} color="success">
                    Confirm Picked Up
                </Button>
            </DialogActions>
            </>
        )}
        </Dialog>
        </>
    )

};

export default PickupFulfillDialog;
