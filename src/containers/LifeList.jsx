import { useState, useMemo } from 'react';
import debounce from '../utils/debounce';

import WebsiteHeader from '../components/WebsiteHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import BirdImages from '../assets/imagesMap';

import '../stylesheets/lifelist.css';

export default function LifeList() {
  const [lifeListData, setLifeList] = useState();
  const [ebirdCodeData, setEbirdCodeData] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const formatBirdName = (birdName) => {
    return birdName.replaceAll(/[^\w]/g, "").toLowerCase();
  };

  fetch('/LifeList.csv')
    .then(response => response.text())
    .then(responseText => setLifeList(responseText));

  const lifeListArray = useMemo(() => {
    if (!lifeListData) return [];

    return lifeListData.split('\r\n').slice(1).reduce((acc, entry) => {
      const [number, name, date, location] = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      if (searchTerm && !formatBirdName(name).includes(formatBirdName(searchTerm))) {
        return acc;
      }

      acc.push({ number, name, date, location });
      return acc;
    }, []);
  }, [lifeListData, searchTerm]);

  fetch('/eBirdBirdCodes.csv')
    .then(response => response.text())
    .then(responseText => setEbirdCodeData(responseText));

  const birdCodesMap = useMemo(() => {
    if (!ebirdCodeData) return {};

    return ebirdCodeData.split('\r\n').slice(1).reduce((acc, entry) => {
      const row = entry.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const [birdName, birdCode] = row;
      acc[formatBirdName(birdName)] = birdCode;
      return acc;
    }, {});
  }, [ebirdCodeData]);

  const photoCheck = {};

  return (
    <>
      {selectedImage &&
        <div className="img-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-background" />
          <div className='lightbox-image-wrapper'>
            <img
              title="Blank SVG World Map"
              alt="SVG World Map Using Robinson Projection"
              src={selectedImage}
              className="lightbox-image"
            />
          </div>
        </div >
      }
      <span className="life-list">
        <WebsiteHeader />
        <span className="life-list-container">
          <span className="life-list-left">
            <div className="life-list-header">
              <h2>Bird Watching Life List</h2>
              <TextField
                id="standard-helperText"
                className="search"
                label="Search"
                size="small"
                variant="standard"
                onChange={debounce(({ target: { value } }) => setSearchTerm(value), 100)}
              />
            </div>
            <Paper className="life-list-paper">
              <TableContainer className="bird-table" >
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
                    {
                      !lifeListArray.length &&
                      <TableRow >
                        <TableCell component="th" scope="row"><b>{`No bird matches "${searchTerm}"`}</b></TableCell>
                      </TableRow>
                    }
                    {lifeListArray.map(({ number, name, date, location }, index) => {
                      const birdKey = formatBirdName(name);

                      let birdName = <b>{name}</b>;
                      if (birdCodesMap[birdKey]) {
                        birdName = <a className="bird-link" href={`https://ebird.org/species/${birdCodesMap[birdKey]}`} target='_blank'>
                          {birdName}
                        </a>;
                      } else if (Object.keys(birdCodesMap).length > 0 && !birdCodesMap[birdKey]) {
                        console.log("No bird code found for: ", name);
                      }

                      let birdImageLink = null;
                      if (BirdImages[birdKey]) {
                        photoCheck[birdKey] = true;
                        birdImageLink = <a className='bird-image' onClick={() => setSelectedImage(BirdImages[birdKey])}>📷</a>;
                      }

                      return (
                        <TableRow style={{ backgroundColor: index % 2 === 0 ? '#eeeeeeff' : '' }} key={name}>
                          <TableCell className="bird-number" component="th" scope="row">{number}</TableCell>
                          <TableCell className="bird-name" >{birdName}{birdImageLink}</TableCell>
                          <TableCell className="bird-date">{date.replaceAll('"', '')}</TableCell>
                          <TableCell className="bird-location" style={{ overflow: 'scroll' }} >{location.replaceAll('"', '')}</TableCell>
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

            <div className='world-map' onClick={() => setSelectedImage('/myVisitedPlaces.jpg')}>
              <img title="Bird Watching World Map" alt="Bird Watching Destinations World Map" src="/myVisitedPlaces.jpg" className="img-responsive" />
            </div>

          </span>
        </span>
      </span >
    </>
  );

}