import React, { useState } from 'react';
import axios from 'axios';
import '../../css/bodypage.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup';

function Sales(props) {

  const [ receiptList, setReceiptList ] = useState({})

  function addRecipeButtons() {
    axios.get('http://127.0.0.1:8080/?command=')
  }

  function addGroupsButtons() {

  }

  function izmeni() {

  }

  function ukloni() {

  }

  function naplati() {

  }

  function dodajNaRacun() {
    ///  Prikazije listu stolova na koje je moguce dodati racun pre naplate
  }

  function dostava() {
    ///  Salje na sajt porudzbinu i ceka odgovor
  }

  return (

    <div id="sales-page">
      <Container className="background-div">
        <Row id="manager-main">
            <Col xs={3} sm={3} md={3} lg={3} xl={3} id="manager-left">
            </Col>

            <Col xs={6} sm={6} md={6} lg={6} xl={6} id="manager-center">
            <Button id="addItemButton">Add</Button>
            </Col>

            <Col xs={3} sm={3} md={3} lg={3} xl={3} id="manager-right">
                <div id="receipt-item-list">

                <ListGroup className="scroll-container" id="receiptList">
                </ListGroup>

                <div><label id='total'>Total: 0.00 $</label></div>
                </div>

                <div id="sales-exec-buttons">
                <table id="table-buttons">
                    <tbody>

                    <tr>
                    <td><Button onClick={izmeni} variant='light'className="btn">Izmeni</Button></td>
                    <td><Button onClick={ukloni} variant='danger' className="btn" >Ukloni</Button></td>
                    </tr>
                    <tr>
                    <td colSpan="2"><Button onClick={naplati} variant='success' className="btn">Naplati</Button></td>
                    </tr>
                    <tr>
                    <td><Button onClick={dodajNaRacun} variant='light' className="btn">Dodaj na racun</Button></td>
                    <td><Button onClick={dostava} variant='warning' className="btn">Dostava</Button></td>
                    </tr>
                    
                    </tbody>
                </table>              
                </div>
            </Col>
        </Row>    
    </Container>
  </div>

  )
}

export default Sales