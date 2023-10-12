import React, {useState} from 'react'
import axios from 'axios'
import '../../../css/options/invoices-components/CompanyList.css'

function CompanyList({loadCompanyData, refreshCompanyData, listOfCompanies, setListOfCompanies}) {

//# Variables ---------------------------------------------------------------------
const [ selectedCompany, setSelectedCompany ] = useState('')

//# Search queries --------------------------------------------
const [ compQuerySearch, setCompQuerySearch ] = useState('')

//# List setup --------------------------------------------------------------------                          
  const companyName = listOfCompanies.filter(item => item.name.toLowerCase().includes(compQuerySearch.toLowerCase()));

  const companyID = listOfCompanies.filter(item => item.ID.toLowerCase().includes(compQuerySearch.toLowerCase()));

  const printList = companyName.concat(compQuerySearch ? companyID : [])

  //# Functiones ------------------------------------------------------------------
  function loadData() {
    if (selectedCompany) {
      loadCompanyData(selectedCompany)
    }
  }
  
  function selectCompany(id) {
    const comp = selectedCompany
    if (comp[0] === id[0] && comp[1] === id[1]) setSelectedCompany(["",""])
    if (comp[0] !== id[0] && comp[1] !== id[1]) setSelectedCompany(id)
  }

  function deleteButton() {
    console.log(selectedCompany)
    if (!selectedCompany) return 
    const id = `ID=${selectedCompany[0]}`
    const name = `name=${selectedCompany[1]}`
    axios.delete(`http://127.0.0.1:8080/?command=deleteCompany&${id}&${name}`)
    .then(async(res)=> {
      if (res.status === 200) {
        setListOfCompanies(()=> listOfCompanies.filter(list => list[0] !== selectedCompany));
        refreshCompanyData()
        setSelectedCompany('')
      }
      if (res.status !== 200) {console.log(res.status)}
    })
  }

  return (
  <div className='aside-company'>

    <div className='aside-company-buttons'>
      <input name='companies' type='search' onChange={(e)=> setCompQuerySearch(e.target.value)}/>
      <button onClick={loadData}>Load data</button>
      <button onClick={deleteButton}>Delete</button>
    </div>

    <div className='aside-company-header'>
        <p style={{flex: '1', marginLeft: '13px'}}>logo</p>
        <p style={{flex: '3'}}>name</p>
        <p style={{flex: '3', marginRight: '25px'}}>ID</p>
    </div>

    <div className='aside-company-list'>
      {printList.map((company, index) => 
        <div className='list' 
             key={index} 
             style={selectedCompany[0] === company.ID && selectedCompany[1] === company.name ? 
                {cursor: 'pointer', backgroundColor: "darkgreen"} :
                {cursor: 'pointer'}}
             onClick={()=>selectCompany([company.ID, company.name])}>
            { company.icon ? <img alt='' src={company.icon}/> :
                           <img alt='' src={require('../../../images/redpdf.ico')}/> }
            <p>{company.name}</p> 
            <p>{company.ID}</p> 
        </div>)}
    </div>

  </div>
  )
}

export default CompanyList