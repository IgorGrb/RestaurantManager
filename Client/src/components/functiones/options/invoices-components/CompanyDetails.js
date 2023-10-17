import React, {useState, useEffect, useRef} from 'react'
import '../../../css/options/invoices-components/CompanyDetails.css'
import LoadCompanyLogoModal from '../../modals/LoadCompanyLogoModal'
import CompanyList from './CompanyList'
import axios from 'axios'

function CompanyDetails({ 
    companyObject, setCompanyObject,
    invoiceObject, setInvoiceObject,
    switches, setSwitches,
    globalSettings}) {
  
  const IP = globalSettings.IP
  const PORT = globalSettings.PORT

  const [ logoModal, setLogoModal ] = useState(false)
  const [ contact, setContact ] = useState('')
  const [ contactNumber, setContactNumber ] = useState('')
  const [ contactList, setContactList ] = useState([])
  const [ listOfCompanies, setListOfCompanies ] = useState([])
  
  let checkBox = useRef(null)

//#-------------------------------------
function updateCompany() {
  const data = {...companyObject, command: "updateCompanyData"}
  console.log(data)
  axios.put(`http://${IP}:${PORT}`, data)
  .then((response) => {
    if (response.status === 200) {
      loadCompanyData([companyObject.companyID, companyObject.companyName])
    }
  })
}

function updateCompanyComment () {
  const data = {companyID: companyObject.companyID, 
                companyName: companyObject.companyName,
                comment: companyObject.comment, 
                command: "updateCompanyComment"}
  console.log(data)
  axios.put(`http://${IP}:${PORT}`, data)
  .then((response) => {
    if (response.status === 200) {
      loadCompanyData([companyObject.companyID, companyObject.companyName])
    }
  }) 
}

function removeContact(name) {  // READY    Contact Details
  const newList =  companyObject.contactList.filter(contact => contact !== name)
  setCompanyObject({...companyObject, contactList: newList})
  makeContactList(newList)
}

function makeContactList(list) {  // READY    Contact Details
setContactList(
  list.map((name, index) => (
    <div key={index} className='contact-details'>
      <p>{name[0]}</p>
      <p>{name[1]}</p>
      <img alt='' 
            src={require('../../../images/cancel-red.ico')}
            onClick={() => removeContact(name)}/>
    </div>
  ))
)
}

function setCompanyDetails(data=false) {  // READY
if (data) {
  setCompanyObject({
      companyID: data.ID,
      companyName: data.name,
      logo: data.logo,
      icon: data.icon,
      address: data.address,
      phoneNumber: data.phoneNumber,
      website: data.website,
      contactList: data.contactList,
      comment: data.comment
  })
}
if (!data) {    
  setCompanyObject({
    companyID: '',
    companyName: '',
    logo: '',
    icon: '',
    address: '',
    phoneNumber: '',
    website: '',
    contactList: [],
    comment: ''
  })
} 
}

async function loadCompanyData(select) {
const dataObj = {command: "loadCompanyData", ID: `${select[0]}`, name: `${select[1]}`}
const response = await axios.post(`http://${IP}:${PORT}/`, JSON.stringify(dataObj))
  if (response.status === 200) {
    const data = response.data.data
    setSwitches({...switches, loadedCompData: true, disableFields: true})
    makeContactList(data.contactList && data.contactList.length ? data.contactList : [])   
    setInvoiceObject((oldData)=>{
      return {
        ...oldData,
        companyID: data.ID,
        companyName: data.name
      }})  
    setCompanyDetails(data)
  }
  if (response.status !== 200) {
    console.log(response.status, response.data)
  }
}

async function refreshCompanyData() {
try {
  const response = await axios.get('http://127.0.0.1:8080/?getCompaniesList');
  if (response.status === 200) {
    console.log(response.data.data)
    setListOfCompanies(response.data.data);
  } else {
    console.log("Error while getting List Of Companies", response.data);
  }
} catch (error) {
  console.error("An error occurred:", error);
}
}

async function saveCompanyData() {
console.log(companyObject.companyID)
if (!companyObject.companyID) return 
const data = {...companyObject, command: "saveCompanyData"}
const response = await axios.post('http://127.0.0.1:8080/', JSON.stringify(data))
  if (response.status === 200) {
    console.log('Server response:', response.data);
    setCompanyDetails(false)
    refreshCompanyData()
  }
  if (response.status === 402) {
    console.log('Error:', response.data);
    refreshCompanyData()
  }
  if (response.status === 401) {
    console.log(response.data)
    refreshCompanyData()
  }
}

//#-------------------------------------

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/?getCompaniesList');
        if (response.status === 200) {
          setListOfCompanies(response.data.data);
        } else if (response.status === 201) {
          console.log("Company list is empty")
        } else {
          console.log("Error while getting List Of Companies", response.data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  
    fetchData();
  }, []);

async function returnButton() { // READY
  setSwitches({...switches, disableFields: false, loadedCompData: false})
  setInvoiceObject({
    ...invoiceObject,
    companyID: '',
    companyName: ''
  })
  setCompanyDetails()
  setContactList([])
  }
  
  function addContact() {  // READY
    if (contact || contactNumber) {
        const list = [contact, contactNumber]
        const newList = companyObject.contactList.concat([list]);
        setCompanyObject({...companyObject, contactList: newList})
        makeContactList(newList);
        setContact('')
        setContactNumber('')
      };
  } 

  useEffect(()=>{
    setContactList(
      companyObject.contactList.map((name, index) => (
        <div key={index} className='contact-details'>
          <p>{name[0]}</p>
          <p>{name[1]}</p>
          <img alt='' 
               src={require('../../../images/cancel-red.ico')}
               onClick={() => removeContact(name)}/>
        </div>
      ))
    )
  }, [])





/// ### HTML --------------------------------------------------------------- 
  return (
  <div className='company-details-main'>
    <div className='company-details'>

            <div className='title-company-details'> 
              <p><b>Company details</b></p>
            </div>

            <div className='column1-company-details'>
              <img className='company-logo'
                   name='logo' 
                   alt='' 
                   onChange={(e)=> setCompanyObject({...companyObject, logo: e.target.value})} 
                   onClick={()=>setLogoModal(true)}
                   style={{cursor: 'pointer'}}
                   src={companyObject.logo}/>
            </div>
            
            <div className='column2-company-details'>
              
              <div>
                <label htmlFor='company-name'>Company name:</label>
                <input id='company-name' 
                       name='company-name' 
                       value={companyObject.companyName}
                       placeholder={companyObject.companyName}
                       disabled={switches.disableFields} 
                       onChange={(e)=> {
                          setCompanyObject({...companyObject, companyName :e.target.value})
                          setInvoiceObject({...invoiceObject, companyName: e.target.value})}} 
                       type='text' />
              </div>
              <div>
                <label htmlFor='id-code'>Unique ID:</label>
                <input id='id-code' 
                       name='id-code'
                       value={companyObject.companyID}
                       placeholder={companyObject.companyID}
                       disabled={switches.disableFields || switches.loadedCompData} 
                       onChange={(e)=> {
                          setCompanyObject({...companyObject, companyID :e.target.value})
                          setInvoiceObject({...invoiceObject, companyID: e.target.value})}} /* ADD SAVEITNG TO Invoices.js / invoiceObject */
                       type='text' />
              </div>
              
            </div>

            <div className='column3-company-details'>
              <div>
                <label htmlFor='address'>Full address:</label>
                <input id='address' 
                       name='address'
                       value={companyObject.address}
                       placeholder={companyObject.address} 
                       type='text' 
                       disabled={switches.disableFields} 
                       onChange={(e)=> setCompanyObject({...companyObject, address: e.target.value})} />
              </div>
              <div>
                <label htmlFor='phone-number'>Phone number:</label>
                <input id='phone-number' 
                       name='phoneNumber'
                       value={companyObject.phoneNumber} 
                       placeholder={companyObject.phoneNumber}
                       disabled={switches.disableFields} 
                       onChange={(e)=> setCompanyObject({...companyObject, phoneNumber: e.target.value})} 
                       type='text' />
              </div>
              <div>
                <label htmlFor='website'>Company's website:</label>
                <input id='website' 
                       name='website'
                       value={companyObject.website} 
                       placeholder={companyObject.website}
                       disabled={switches.disableFields} 
                       onChange={(e)=> setCompanyObject({...companyObject, website: e.target.value})} 
                       type='url' />
              </div>
            </div>

            <div className='column4-company-details'>
              <p>Company contacts:</p>
              <div className='contact-input'>
                <input name='contactName' 
                       type='text' 
                       placeholder='name' 
                       disabled={switches.disableFields} 
                       onChange={(e)=> setContact(e.target.value)}
                       value={contact ? contact : ''}/>
                <input name='contactPhone' 
                       type='text' 
                       placeholder='phone No' 
                       disabled={switches.disableFields} 
                       onChange={(e)=> setContactNumber(e.target.value)}
                       value={contactNumber ? contactNumber : ''}/>
                    <img src={require('../../../images/green-checkmark.ico')} 
                        alt='add' 
                        style={{cursor: 'pointer'}}
                        onClick={()=> addContact()}/>
              </div>
              
              <div className='contact-list'>
                {contactList}
              </div>

            </div>

            <div className='column5-company-details'>
             <textarea value={companyObject.comment}
                       onChange={(e)=>setCompanyObject({...companyObject, comment: e.target.value})}/>
             <button onClick={updateCompanyComment} disabled={!switches.loadedCompData}>Update comment</button>
            </div>

            <div className='column6-company-details'>
              { switches.loadedCompData && <button onClick={returnButton}>Return</button> }
              { switches.loadedCompData ? <button disabled={switches.disableFields} 
                                                  onClick={() => {updateCompany()
                                                  checkBox.current.checked = false}}>Update data</button> : 
                             <button disabled={!switches.disableFields} onClick={()=>{saveCompanyData()
                                                                        checkBox.current.checked = false}}>Save data</button> }
              { switches.loadedCompData && <div>
                               <label htmlFor='loaded-checkbox'>Update:</label>
                               <input ref={checkBox} type='checkbox' onChange={(e)=> setSwitches({...switches, disableFields: !e.target.checked})} id='loaded-checkbox'/>
                             </div>}
              { !switches.loadedCompData && <div>
                               <label htmlFor='lockCompanyData'>Ready:</label>
                               <input ref={checkBox} id='lockCompanyData' type='checkbox' onChange={(e) => setSwitches({...switches, disableFields: e.target.checked}) }/>
                             </div>}
            </div>

            <LoadCompanyLogoModal
                companyObject={companyObject} setCompanyObject={setCompanyObject}
                show={logoModal}
                onHide={()=>setLogoModal(false)}/>

          </div>

          <CompanyList 
            refreshCompanyData={refreshCompanyData}
            loadCompanyData={loadCompanyData}
            listOfCompanies={listOfCompanies} setListOfCompanies={setListOfCompanies}/> 


  </div>
  )
}

export default CompanyDetails