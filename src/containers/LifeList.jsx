import { useState } from 'react';

import WebsiteHeader from '../components/WebsiteHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import '../stylesheets/lifelist.css';

export default function LifeList() {
    const [lifeListData, setLifeList] = useState();

    fetch('/LifeList.csv')
        .then(response => response.text())
        .then(responseText => setLifeList(responseText));

    const lifeListArray = lifeListData ?
        lifeListData.split('\r\n').slice(1).map(entry => {
            console.log({ entry });
            const row = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return {
                number: row[0],
                name: row[1],
                date: row[2],
                location: row[3]
            };
        })
        : [];

    return (
        <span className="life-list">
            <WebsiteHeader />
            <span className="life-list-container">
                <span className="life-list-left">
                    <h2>Life List</h2>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: '80vh' }} >
                            <Table stickyHeader aria-label="simple table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: 'white', backgroundColor: "#333" }}>No.</TableCell>
                                        <TableCell style={{ color: 'white', backgroundColor: "#555" }}>Name</TableCell>
                                        <TableCell style={{ color: 'white', backgroundColor: "#333" }}>Date</TableCell>
                                        <TableCell style={{ color: 'white', backgroundColor: "#555" }}>Location</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lifeListArray.map(({ number, name, date, location }, index) => (
                                        <TableRow style={{ backgroundColor: index % 2 === 0 ? '#eeeeeeff' : '' }} key={name}>
                                            <TableCell component="th" scope="row">{number}</TableCell>
                                            <TableCell >{name}</TableCell>
                                            <TableCell >{date.replaceAll('"', '')}</TableCell>
                                            <TableCell style={{ overflow: 'scroll' }} >{location.replaceAll('"', '')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </span>
                <span className="life-list-right">
                    {/* Todo add cool underlines */}
                    <h2>My Bird Watching Destinations</h2>
                    <div className="world-map">
                        <img title="Blank SVG World Map" alt="SVG World Map Using Robinson Projection" src="/world.svg" className="img-responsive" />
                    </div>
                </span>
            </span>
        </span>
    );

}