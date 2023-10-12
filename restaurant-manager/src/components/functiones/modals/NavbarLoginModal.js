import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';

function LoginModal(props) {

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  
  const changeHandeler = (e) => {
    if (e.target.name === 'username') {
      setUsername(e.target.value)
    } else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
  }

  let login = () => {
    return new Promise(async (resolve, reject) => {
      console.log('LoginModal - login request sent')
      const command = `/?command=login&username=${username}&password=${password}`
      await axios.post('http://127.0.0.1:8080'+ command)    
      .then(async (response) => {
        if (response.status === 200) {
          console.log('LoginPage - logIn response recieved')
          const data = response.data
          await props.login(data);
          console.log('LoginPage - logIn() finished')
          props.onHide()
        }
      })
      .catch(error => {
        console.log('LoginModal - login request failed')
        setUsername('');
        setPassword('');
        console.log(error)
      })
      resolve()
    })}


  return (
    <Modal
      {...props}
      size='sm'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Log In
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={async() => login()}>Log In</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal
/* render(<LoginModal />); */