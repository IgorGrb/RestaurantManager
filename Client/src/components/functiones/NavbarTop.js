import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../css/navbartop.css'
import Button from 'react-bootstrap/esm/Button';
import LoginModal from './modals/NavbarLoginModal';


function NavbarTop (props) {

  const options = props.selectedUser
  const users   = props.loggedUsers
  const [usersData, setUsersData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [loginModal, setLoginModal] = useState(false);


  useEffect(() => {
    setUsersData(users.map((user, index) => (
      <NavDropdown.Item
        onClick={(e)=>selectUser(e)}
        name={user.Name}
        /* className={user.Name === options.Name ? 'selected-user' : ''} */
        style={{backgroundColor: user.Name === options.Name ? 'rgb(35, 155, 155)' : '',
        borderRadius: user.Name === options.Name ? '20px' : ''}}
        key={index}
      >
        {user.Name}
      </NavDropdown.Item> 
    )))
    console.log('Hydrating Users')
    console.log(users)
    }, [users, options]);

  useEffect(() => {
    setOptionsData(
    options.AccessList && options.AccessList.length ? 
    options.AccessList.map((item, index) => (
      <NavDropdown.Item key={index} 
      name={item.toUpperCase()} 
      onClick={(e)=>selectOption(e)}>
        {item}
      </NavDropdown.Item>
    )) : []);
    console.log('Hydrating User options')
    }, [options])


  const logOut = (user) => {
    return new Promise(async (resolve, reject) => {
      await props.setLoggedUser('REMOVE', props.selectedUser.Name, true)
      await props.setSelectedUser('', true)
      await props.localStorageData('REMOVE', props.selectedUser.Name)
      await props.selectOption('')
    })
  }

  function selectUser(e) {
    return new Promise(async (resolve, reject) => {
      const data = await JSON.parse(localStorage.getItem('loggedUsers'))
      console.log(data)
      const userData = await data.filter(user => user.Name === e.target.name)
      console.log(userData)
      props.setSelectedUser(userData[0])
      console.log(options)
    })
  }

  function selectOption(e) {
    return new Promise(async(resolve, reject) => {
      console.log(e.target.name)
      console.log(typeof e.target.name)
      props.selectOption(e.target.name)
    })
  }

  const clearStorage = () => {
    return new Promise(async (resolve, reject) => {
      localStorage.clear()
      console.log(props.selectedUser.Name)
      await props.setLoggedUser('REMOVE', props.selectedUser.Name, true)
      await props.selectPage('LOGIN', true)
      resolve()
    })}

  const login = () => {
    setLoginModal(true)
  }

  const renderNavbar = () => {

  console.log('Render navbar function')
    return (
      
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Button variant='light' onClick={async() => await clearStorage()}>Empty</Button>
          <Button variant='light' onClick={() => login()}>Log In</Button>
          <LoginModal />
          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Logged Users">
              {usersData}
              </NavDropdown>
              <NavDropdown title="Options" id='Options'>
                <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>
                {optionsData}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <LoginModal
          show={loginModal}
          onHide={() => setLoginModal(false)}
          login={props.login}
        />
      <h2>{props.selectedUser.Name}</h2>
      </Navbar>
    );
  };

  const navbar = renderNavbar();
  console.log('Rendering page')
  return navbar;
}

export default NavbarTop