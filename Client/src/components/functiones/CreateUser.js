import React, { useState } from 'react'
import '../css/createuser.css'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

/* Missing reaction to server response */

function CreateUser ({selectPage}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rptPassword, setRptPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPosition, setSelectedPosition] = useState({Name: 'Sales', Value: 'Sales'});
  const [responseMessage, setResponseMessage] = useState('');

  const changePosition = (e) => {
    if (e.target.value === 'Sales') {
      setSelectedPosition({Name: 'Sales', Value: "Sales"})
    } else if (e.target.value === 'Manager') {
      setSelectedPosition({Name: 'Manager', Value: "Manager"})
    } else if (e.target.value === 'Admin') {
      setSelectedPosition({Name: 'Admin', Value: "Admin"})
    } else {
      console.log('Failed changing position')
    }
  }

  const changeHandeler = (e) => {
    if (e.target.name === 'username') {
      setUsername(e.target.value)
    } else if (e.target.name === 'password') {
      setPassword(e.target.value)
    } else if (e.target.name === 'rpt-pass') {
      setRptPassword(e.target.value)
    } else if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
  }


  const createUser = () => {
    setResponseMessage('')
    const data = { 
                   command : "createUser", 
                   username: username,
                   password: password,
                   rpt_password: rptPassword,
                   email: email,
                   position: selectedPosition.Value
                  }
    const headers = { headers: {'Content-Type': 'application/json'}}

    axios.post('http://127.0.0.1:8080/', data, headers)
      .then(response => {
        if (response.status === 200) {
          setResponseMessage(response.data);
          setUsername('');
          setPassword('');
          setRptPassword('');
          setEmail('');
          setSelectedPosition({Name: 'Sales', Value: "Sales"});

        } else if (response.status === 401 || response.status === 404) { // Making problem
          console.log(response.data)
          setResponseMessage(response.data);
          setUsername('');
          setPassword('');
          setRptPassword('');
          setEmail('');
          setSelectedPosition({Name: 'Sales', Value: "Sales"});
        } else if (response.status === 402) {
          setResponseMessage(response.data);
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  /* const setBackground = () => {
    document.body.className = '';
    document.body.classList.add('background-login');
  }

  setBackground(); */

    return (
      <div>

<div className="background">
    <div id="gray-box-createuser">
        <div id="create_user_elements">
          {responseMessage && <Row><label id='response'>{responseMessage}</label></Row>}
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3 createUser"  id='Username_entry'>
                    <Form.Control name='username' value={username} onChange={changeHandeler} type="text" placeholder="Username" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3 createUser" id='Password_entry'>
                    <Form.Control name='password' value={password} onChange={changeHandeler} type="password" placeholder="Password" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3 createUser" id='Repeat_password'>
                    <Form.Control name='rpt-pass' value={rptPassword} onChange={changeHandeler} type="password" placeholder="Repeat password" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3 createUser" id='Email_entry'>
                    <Form.Control name='email' value={email} onChange={changeHandeler} type="email" placeholder="email" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Form.Select id="position" value={selectedPosition.Name} aria-label="Default select example" onChange={changePosition}>
                    <option name='Sales'>Sales</option>
                    <option name='Manager'>Manager</option>
                    <option name='Admin'>Admin</option>
                </Form.Select> 
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row id="Buttons_row">
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}><Button onClick={createUser} id="create_user" type="submit" variant='info' className='btn' size='sm'>Create user</Button></Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}><Button onClick={() => selectPage('LOGIN')} type="button" variant='info' className='btn' size='sm'>Cancel</Button></Col>  
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
        </div>
    </div>
</div>

      </div>
    )
  }


export default CreateUser