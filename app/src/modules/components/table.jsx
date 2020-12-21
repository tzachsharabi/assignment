import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    paper: {
        height: 400,
        width: '100%',
        marginTop: 0,
        overflow: 'auto',
        background: 'rgb(184,184,184)'
    },
    noDataShown: {
        textAlign: 'center',
        margin: '160px auto',
        background: '#393939',
        color:  '#ececec'
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#393939',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#dcdcdc',
        },
        '&:nth-of-type(even)': {
            backgroundColor: '#d2d2d2',
        }
    },
    hover: {
        "&:hover": {
            backgroundColor: "#e5e5e5 !important",
            color: " #fff !important",
        },
    },
}))(TableRow);


const createTableComponent = (props) => {
    const tableHeaders = props.tableHeaders || [];
    const tableData = props.tableData || [];

    return (<Table style={{minWidth: props.width}} stickyHeader aria-label="simple table">
        <TableHead>
            <StyledTableRow hover key={0}>
                {tableHeaders.map((header, cellIdx) => {
                    return <StyledTableCell component="th" scope="row" key={cellIdx}>{header}</StyledTableCell>;
                })}
            </StyledTableRow>
        </TableHead>
        <TableBody>
            {tableData.map((data, rowIdx) => {
                return <StyledTableRow hover key={rowIdx}> {Object.keys(data).map((key, cellIdx) => {
                    return <StyledTableCell key={cellIdx}>{data[key]}</StyledTableCell>;
                })}
                </StyledTableRow>
            })}
        </TableBody>
    </Table>);
}

function BasicTable(props) {
    const { classes , theme} = props;
    const tableComponent = createTableComponent(props);

    return (
        <TableContainer component={Paper} className={classes.paper} style={{'overflowY': 'scroll'}}>
            {tableComponent}
        </TableContainer>
    );
}
export default withStyles(styles, { withTheme: true })(BasicTable);
