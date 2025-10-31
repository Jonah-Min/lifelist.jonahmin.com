import { useState } from 'react';

import WebsiteHeader from '../components/WebsiteHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Zoom from 'react-medium-image-zoom';

import '../stylesheets/lifelist.css';

export default function LifeList() {
    const [lifeListData, setLifeList] = useState();
    const [ebirdCodeData, setEbirdCodeData] = useState();
    const [zoomWorldMap, setZoomWorldMap] = useState(false);

    fetch('/LifeList.csv')
        .then(response => response.text())
        .then(responseText => setLifeList(responseText));

    const lifeListArray = lifeListData ?
        lifeListData.split('\r\n').slice(1).map(entry => {
            const row = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return {
                number: row[0],
                name: row[1],
                date: row[2],
                location: row[3]
            };
        })
        : [];

    fetch('/eBirdBirdCodes.csv')
        .then(response => response.text())
        .then(responseText => setEbirdCodeData(responseText));

    const birdCodesMap = ebirdCodeData ?
        ebirdCodeData.split('\r\n').slice(1).reduce((acc, entry) => {
            const row = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const [birdName, birdCode] = row;
            acc[birdName.replaceAll(/[^\w]/g, "").toLowerCase()] = birdCode;
            return acc;
        }, {})
        : {};


    return (
        <>
            {zoomWorldMap &&
                <div className="img-lightbox" onClick={() => setZoomWorldMap(false)}>
                    <div className="beeg-background" />
                    <div className='beeg-world-map' onClick={() => setZoomWorldMap(true)}>
                        <img title="Blank SVG World Map" alt="SVG World Map Using Robinson Projection" src="/world.svg" className="img-responsive" />
                    </div>
                </div>
            }
            <span className="life-list">
                <WebsiteHeader />
                <span className="life-list-container">
                    <span className="life-list-left">
                        <h2>My Bird Watching Life List!</h2>
                        <Paper >
                            <TableContainer sx={{ maxHeight: '85vh', borderRadius: "5px" }} >
                                <Table stickyHeader aria-label="simple table" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ color: 'white', backgroundColor: "#333" }}><b>No.</b></TableCell>
                                            <TableCell style={{ color: 'white', backgroundColor: "#555" }}><b>Name</b></TableCell>
                                            <TableCell style={{ color: 'white', backgroundColor: "#333" }}><b>Date</b></TableCell>
                                            <TableCell style={{ color: 'white', backgroundColor: "#555" }}><b>Location</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lifeListArray.map(({ number, name, date, location }, index) => {
                                            let birdName = <b>{name}</b>;

                                            const birdKey = name.replaceAll(/[^\w]/g, "").toLowerCase();
                                            if (birdCodesMap[birdKey]) {
                                                birdName = (
                                                    <a className="bird-link" href={`https://ebird.org/species/${birdCodesMap[birdKey]}`} target='_blank'>
                                                        {birdName}
                                                    </a>
                                                );
                                            }

                                            return (
                                                <TableRow style={{ backgroundColor: index % 2 === 0 ? '#eeeeeeff' : '' }} key={name}>
                                                    <TableCell component="th" scope="row">{number}</TableCell>
                                                    <TableCell >{birdName}</TableCell>
                                                    <TableCell >{date.replaceAll('"', '')}</TableCell>
                                                    <TableCell style={{ overflow: 'scroll' }} >{location.replaceAll('"', '')}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </span>
                    <span className="life-list-right">
                        {/* Todo add cool underlines */}
                        <h2>My Bird Watching Destinations</h2>

                        <div className='world-map' onClick={() => setZoomWorldMap(true)}>
                            <img title="Bird Watching World Map" alt="Bird Watching Destinations World Map" src="/world.svg" className="img-responsive" />
                        </div>

                    </span>
                </span>
            </span >
        </>
    );

}