import React, {useState} from 'react'
import '../css/loginpage.css'
import axios from 'axios'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LogInPage (props) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const changeHandeler = (e) => {
    if (e.target.name === 'username') {
      setUsername(e.target.value)
    } else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
  }

  const setBackground = () => {
    document.body.className = '';
    document.body.classList.add('background-login');
  }

  function logIn() {
    const data = {
                  command: "login", 
                  username: username, 
                  password: password
                 }
   const header = { header: { "Content-Type": "json/application"}}
      
   axios.post('http://127.0.0.1:8080/', data, header)    
      .then(async (response) => {
        if (response.status === 200) {
          const res = response.data
          console.log(data)
          await props.login(res);
          console.log('LoginPage - logIn() finished')
          await props.selectPage('MANAGER')
        }
      })
      .catch(error => {
        console.log(error)
      })
}

  setBackground();

  /* setBackground(); */
    return (
      <div>
        <div className="background">
          <div id="gray-box-login">
            <div id="login_elements">
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3" id='Username'>
                    <Form.Control onChange={changeHandeler} type="text" name='username' placeholder="Username" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Form.Group className="mb-3" id='Password'>
                    <Form.Control onChange={changeHandeler} type="password" name='password' placeholder="Password" />
                  </Form.Group>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            </Row>
            <Row id="Buttons_row">
                <Col xs={4} sm={4} md={4} lg={4} xl={4}><Button id="LogIn_button" type="submit" onClick={async () => await logIn()} variant='info' className='btn' size='sm'>Log In</Button></Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}><Button id="Forgot_password" type="button" variant='info' className='btn' size='sm'>Forgot password</Button></Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}><Button onClick={() => props.selectPage("CREATEUSER")} variant='info' className='btn' size='sm'>Create user</Button></Col>
            </Row>
            </div>
          </div>
        </div>
      </div>
    )
}


export default LogInPage