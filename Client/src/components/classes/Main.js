import React, { Component } from 'react'
import NavbarTop from '../functiones/NavbarTop'
import PageBody from './PageBody'
import LogInPage from '../functiones/LogInPage'
import '../css/loginpage.css'
import '../css/main.css'
import CreateUser from '../functiones/CreateUser'

class Main extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
           page: 'LOGIN',
           selectedUser: '',
           loggedUsers: [],
           loginModal: false,
           selectedOption: '',
           globalSettings: {
                    companyName: '',
                    invoicePrefix: 'BSK',
                    TAX: 1.19,
                    unitsOfMeasurement: ['kg', 'L'],
                    IP: "127.0.0.1",
                    PORT: "8080",
                    colorScheme: []}
        }

        this.selectPage = this.selectPage.bind(this);
        this.setSelectedUser = this.setSelectedUser.bind(this);
        this.setLoggedUsers = this.setLoggedUsers.bind(this);
        this.setLoginModal = this.setLoginModal.bind(this);
        this.login = this.login.bind(this);
        this.localStorageData = this.localStorageData.bind(this);
        this.setBackground = this.setBackground.bind(this);
      } 

//# setState FUNCTIONES -------------
  selectPage = (value, returnValue=false) => {  /// READY
    return new Promise((resolve, reject) => {
        this.setState({ page: value }, 
          () => {
            if (returnValue) {
              resolve(true);
            } else {
              resolve();
            }
          });
        })};


  setSelectedUser = (user, returnValue=false) => {   /// READY
    console.log('setSelectedUser started')
    return new Promise((resolve, reject) => {
      console.log('setSelectedUser')
      this.setState({ selectedUser: user }, 
        () => {
          console.log(this.state.selectedUser);
          if (returnValue) {
            resolve(true);
          } else {
            resolve();
          }
        });
      })}


  setLoggedUsers = (command, username, returnValue=false) => {  // command = 'add' READY
    if (command === 'ADD') {
      return new Promise((resolve, reject) => {
        this.setState({ loggedUsers: this.state.loggedUsers.concat([username])}, 
          () => {
            console.log(this.state.loggedUsers);
            if (returnValue) {
              resolve(true);
            } else {
              resolve();
            }
          });
        })

     } else if (command === 'REMOVE') {
      return new Promise((resolve, reject) => {
      const newList = this.state.loggedUsers.filter
      ((user) => user.Name !== username) /// CHECK SYNTAX
      this.setState({
        loggedUsers: newList
      }, () => {
        if (returnValue) {
          resolve(true)
        } else {resolve()}}
        )      
    })}}

  setOption = (value) => {
    return new Promise(async(resolve, reject) => {
      this.setState({
        selectedOption: value
      }, () => {
        console.log('Selected option');
      })
    })
  }

  setLoginModal = (value) => {
    this.setState({
      loginModal: value
    })
  }


  login = (user) => {       /// DEFINETLY READY
    return new Promise(async (resolve, reject) => {
      console.log('Main - login() stareted')
      const step1 = await this.setSelectedUser(user, true);
      const step2 = await this.setLoggedUsers('ADD', user, true);
      console.log(step1, step2)
      if (step1 === true && step2 === true) {
        await this.localStorageData('SAVE')
        console.log('login() - after', this.state)
        resolve()
      } else {
        reject()
      } 
    })}



  localStorageDataCheck = () => {
    const check = this.state.loggedUsers.length

    if (!check) {  // IF loggedUsers IS NOT EMPTY
        const selectedUser = JSON.parse(localStorage.getItem('selectedUser'))
        const existingData = localStorage.getItem('loggedUsers');
        const usersData = JSON.parse(existingData);

        console.log(usersData)
        console.log(this.state.loggedUsers)

        if (usersData !== null && usersData.length) { //IF NOT null OR LENGTH 0
          return new Promise(async (resolve, reject) => {
            const step1 = await this.selectPage('MANAGER', true);
            const step2 = await this.setLoggedUsers('add', usersData, true);
            const step3 = await this.setSelectedUser(selectedUser, true)
            if (step1 === true && step2 === true && step3 === true) {
              resolve()
            }})         
        } else {
          return new Promise(async (resolve, reject) => await this.selectPage('LOGIN'));
        }
    } else if (check) {
      return new Promise(async (resolve, reject) => await this.selectPage('MANAGER'));
    }
  }



  localStorageData = (command, name) => {
    if (command === 'SAVE') { 

      return new Promise(async (resolve, reject) => {
        const selectedUser = JSON.stringify(this.state.selectedUser);
        const loggedUsers = JSON.stringify(this.state.loggedUsers);
        localStorage.setItem('selectedUser', selectedUser);
        localStorage.setItem('loggedUsers', loggedUsers);
        resolve()
      })
      

    } else if (command === 'LOAD') {
      
      const loadUser = localStorage.getItem('selectedUser');
      const selectedUser = JSON.parse(loadUser);
      const loadListOfUsers = localStorage.getItem('loggedUsers');
      const loggedUsers = JSON.parse(loadListOfUsers);

      if (loggedUsers && loggedUsers.length) {
        return new Promise(async (resolve, reject) => {
          await this.setSelectedUser(selectedUser, true);
          await this.setLoggedUsers(loggedUsers, true);
          resolve()
        })        
      }

    } else if (command === 'REMOVE') {

      const getData = localStorage.getItem('loggedUsers');
      const loggedUsers = JSON.parse(getData)
      const updatedList = loggedUsers.filter(obj => obj.Name !== name); 
      if (updatedList !== null && updatedList.length) {
        return new Promise(async (resolve, reject) => {
          await this.localStorageData('loggedUsers', updatedList)  
          resolve(true)
        })
        } else {
          return new Promise(async (resolve, reject) => {
            await this.selectPage('LOGIN')
            resolve(true)
          })
        }
    }
  }  
  
  setBackground = (className) => {
    document.body.className = '';
    document.body.classList.add(className);
  }

  render() {


    const {selectedUser, loggedUsers, selectedOption} = this.state

    if (this.state.page === 'MANAGER') {
        return (
            <div>
                <NavbarTop 
                selectedUser = {selectedUser} 
                loggedUsers = {loggedUsers}
                selectOption = {this.setOption}
                selectPage={this.selectPage} 
                setSelectedUser={this.setSelectedUser}
                setLoggedUser={this.setLoggedUsers}
                login={this.login} 
                localStorageData={this.localStorageData} 
                localStorageDataCheck={this.localStorageDataCheck}/>
               <PageBody 
                    pageOption={selectedOption}
                    globalSettings={this.state.globalSettings}/> 
            </div>
        )
    } else if (this.state.page === 'LOGIN') {
    return (
      <div>
        <LogInPage selectPage={this.selectPage} login={this.login} />
      </div>
    )
    } else if (this.state.page === 'CREATEUSER') {
      return (
        <div>
          <CreateUser  selectPage={this.selectPage} />
        </div>
      )
    }
  }
  }


export default Main