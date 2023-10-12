import React, { useState } from 'react'
import '../../css/options/invoices.css'
import CompanyDetails from './invoices-components/CompanyDetails'
import ItemsDetails from './invoices-components/ItemsDetails'


function Invertory({ globalSettings }) {

  const companyPrefix = globalSettings.companyPrefix
  const units = globalSettings.unitsOfMeasurement

  const [ switches, setSwitches ] = useState({
    disableFields: false,
    loadedCompData: false,
    loadedInvoData: false
  })

  let [ companyObject, setCompanyObject ] = useState({
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

  const [ invoiceObject, setInvoiceObject ] = useState({
    invoiceID: '',
    companyID: '',
    companyName: '',
    date: '',
    invoiceScan: '',
    value: '',
    valueNoTax: '',
    tax: '',
    dsctValue: '',
    dsctPercent: ''
  })

  let [ itemObject, setItemObject ] = useState({
    itemID: '',
    quantity: '', 
    unit: units[0],
    name: '', 
    brand: '', 
    expDate: '', 
    price: '', 
    priceNoTax: '', 
    tax: '', 
    dsctValue: '', 
    dsctPercent: '', 
    pricePerUnit: ''
  })
  

  return (
    <div className='new-invoice'>
      <main>
        <CompanyDetails 
          invoiceObject={invoiceObject} setInvoiceObject={setInvoiceObject}
          companyObject={companyObject} setCompanyObject={setCompanyObject}
          switches={switches} setSwitches={setSwitches}
          globalSettings={globalSettings}/>

        <ItemsDetails 
          companyPrefix={companyPrefix} 
          globalSettings={globalSettings} setSwitches={setSwitches}
          loadedCompData={switches.loadedCompData}
          loadedInvoData={switches.loadedInvoData}
          
          invoiceObject={invoiceObject} setInvoiceObject={setInvoiceObject}
          itemObject={itemObject} setItemObject={setItemObject}/>
      </main>
        
    </div>
  )
}

export default Invertory