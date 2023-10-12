import React, { useState } from 'react'
import axios from 'axios'
import '../../../css/options/invoices-components/InvoiceList.css'

function InvoiceList({loadInvoiceData, refreshInvoiceList,
                      listOfInvoices, setListOfInvoices}) {

//# Variables -------------------------------------------------
  const [ selectedInvoice, setSelectedInvoice ] = useState('')

//# Search queries --------------------------------------------
  const [ invQuerySearch, setInvQuerySearch ] = useState('')

  const companyName = listOfInvoices.filter((item) =>item.name.toLowerCase().includes(invQuerySearch.toLowerCase()));

  const invoiceID = listOfInvoices.filter((item) =>item.ID.toLowerCase().includes(invQuerySearch.toLowerCase()));

  const printList = companyName.concat(invQuerySearch ? invoiceID : [])



  function selectInvoice(data) {
    const invoice = selectedInvoice
    if (invoice[0] === data[0] && invoice[1] === data[1]) setSelectedInvoice(["",""])
    if (invoice[0] !== data[0] && invoice[1] !== data[1]) setSelectedInvoice(data)
  }

  function deleteButton() {
    console.log(selectedInvoice)
    if (!selectedInvoice) return 
    console.log(selectedInvoice)
    const id = `ID=${selectedInvoice[0]}`
    const compID = `CID=${selectedInvoice[1]}`
    axios.delete(`http://127.0.0.1:8080/?command=deleteInvoice&${id}&${compID}`)
    .then(async(res)=> {
      if (res.status === 200) {
        setListOfInvoices(()=> listOfInvoices.filter(list => list[0] !== selectedInvoice));
        refreshInvoiceList()
        setSelectedInvoice('')
      }
      if (res.status !== 200) {console.log(res.status)}
    })
  } 

  return (
    <div className='aside-invoices'>

        <div className='aside-invoices-buttons'>
          <input name='invoices' type='search' onChange={(e)=> setInvQuerySearch(e.target.value)}/>
          <button onClick={()=>loadInvoiceData(selectedInvoice)}>Load invoice</button>
          <button onClick={deleteButton}>Delete</button>
        </div>

        <div className='aside-invoice-header'>
          <p style={{marginLeft: '15px'}}>ID</p>
          <p style={{marginLeft: '15px'}}>name</p>
          <p style={{marginRight: '5px'}}>date</p>
          <p style={{marginRight: '10px'}}>Invoice</p>
        </div>

        <div className='aside-invoice-list'>
          {printList.map((invoice, index) => 
          <div className='list' 
               key={index} 
               style={selectedInvoice[0] === invoice.ID && selectedInvoice[1] === invoice.companyID ? 
                {cursor: 'pointer', backgroundColor: "darkred"} :
                {cursor: 'pointer'}}
               onClick={()=>selectInvoice([invoice.ID, invoice.companyID])}>
              <p>{invoice.ID}</p> 
              <p style={{paddingLeft: "25px"}}>{invoice.name}</p>
              <p>{invoice.date}</p>
              { invoice.scan ? <img alt='' src={require('../../../images/greenpdf.ico')}/> :
                            <img alt='' src={require('../../../images/redpdf.ico')}/> }
          </div>)}
        </div>
    </div>
  )
}

export default InvoiceList