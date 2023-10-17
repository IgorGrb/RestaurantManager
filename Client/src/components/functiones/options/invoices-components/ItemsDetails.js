import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import InvoiceList from './InvoiceList'
import '../../../css/options/invoices-components/ItemsDetails.css'

function ItemsDetails({ globalSettings, setSwitches,
                        loadedCompData, setInvoiceObject,
                        itemObject, setItemObject,
                        invoiceObject, loadedInvoData
                    }) {

    const IP = globalSettings.IP
    const PORT = globalSettings.PORT
    const units = globalSettings.unitsOfMeasurement
    const forbiden = [0.00, 0, NaN, undefined, "NaN"] /* Forbiden values */
    let q = useRef() // Used for focus() after adding to list
    let [ itemsData, setItemsData ] = useState([])  // "ItemsDetails" list of items UNparsed
    const [ invoiceItems, setInvoiceItems ] = useState([]) // "ItemsDetails" list of items PARSED
    const [ listOfInvoices, setListOfInvoices ] = useState([])

//#---------------------------------------------------------------
    async  function refreshInvoiceList() {
        try {
        const response = await axios.get('http://127.0.0.1:8080/?getInvoicesList');
        if (response.status === 200) {
            setListOfInvoices(response.data.data);
        } else if (response.status === 201) {
            console.log("Invoice list is empty")
        } else {
            console.log("Error while getting List Of Companies", response.data);
        }
        } catch (error) {
        console.error("An error occurred:", error);
        }
    }

    function removeItem(obj) { // READY 
        setInvoiceObject((prevValue) => {
        const price = obj.price ? obj.price : 0
        const priceNoTax = obj.priceNoTax ? obj.priceNoTax : 0
        const tax = obj.tax ? obj.tax : 0
        const dsctValue = obj.dsctValue ? obj.dsctValue : 0
        
        const newValue = (parseFloat(prevValue.value) - parseFloat(price)).toFixed(2)
        const newValueNoTax = (parseFloat(prevValue.valueNoTax) - parseFloat(priceNoTax)).toFixed(2)
        const newTax = (parseFloat(prevValue.tax) - parseFloat(tax)).toFixed(2)
        const newDsctValue = (parseFloat(prevValue.dsctValue) - parseFloat(dsctValue)).toFixed(2)
        const newDsctPercent = ((parseFloat(newDsctValue) / (parseFloat(newValue) + parseFloat(newDsctValue))) * 100 ).toFixed(2)
            return {...prevValue,
            value: newValue,
            valueNoTax: newValueNoTax,
            tax: newTax,
            dsctValue: newDsctValue,
            dsctPercent: newDsctPercent}
        })

        setItemsData((prevItemsData) => {
        const { quantity, name, price } = obj
        const newList = prevItemsData.filter(
        (list) => !(list['quantity'] === quantity && list['name'] === name && list['price'] === price)
        );
        parseItemsList(newList);
        return newList;
        });  
    }

    function parseItemsList(list) {   // READY
        setInvoiceItems(
            list.map((item, index) => (
            <div className='items-list-row' key={index}>
                <p className='indexNo'>{(index + 1)}.</p>
                <p className='quantity'>{item['quantity']}{item['unit']}</p>
                <p className='name'>{item['name']}</p>
                <p className='brand'>{item['brand']}</p>
                <p className='exp-date'>{item['expDate']}</p>
                <p className='price'>{item['price']}$</p>
                <p className='price'>{item['priceNoTax']}$</p>
                <p className='tax'>{item['tax']}$</p>
                <p className='discount-percent'>{item['dsctValue']}{item['dsctValue'] ? '$' : ''}</p>
                <p className='discount-value'>{item['dsctPercent']}{item['dsctPercent'] ? '%' : ''}</p>
                <p className='price-per-unit'>{item['pricePerUnit']}$/{units[0]}</p>
                <p className='rubishbin-list'><img src={require('../../../images/recyclebinred.ico')} 
                        alt='' 
                        onClick={() => removeItem(item)}/></p> 
            </div>
            )));
    }

    async function loadInvoiceData(select) {
        if (!select) return
        const dataObj = {
            command: "loadInvoiceData", 
            ID: `${select[0]}`, 
            compID: `${select[1]}`
        }
        axios.post('http://127.0.0.1:8080/', JSON.stringify(dataObj))
        .then(response=> {
        if (response.status === 200) {
            const data = response.data.Data
            const invoice = response.data.Invoice
            setItemsData(data)
            parseItemsList(data) 
            setInvoiceObject((oldData) => {
            return {
                ...oldData,
                invoiceID: invoice.invoiceID,
                date: invoice.date,
                invoiceScan: invoice.invoiceScan, // Maybe needs parsing !!!!
                value: invoice.value,
                valueNoTax: invoice.valueNoTax,
                tax: invoice.tax,
                dsctValue: invoice.dsctValue,
                dsctPercent: invoice.dsctPercent
            }    
            })
            setSwitches((oldData) => {
            return {
                ...oldData,
                loadedInvoData: true
            }
            })
        }
        }) 
    }

    async function saveInvoice() {
        if (!invoiceObject.invoiceID) return
        const data = {...invoiceObject, itemsData: itemsData, command: 'saveInvoiceData'}
        console.log(data)
        const response = axios.post("http://127.0.0.1:8080/", JSON.stringify(data))
        if (response.status === 200 ) {
        console.log(response.status)
        setInvoiceObject((oldData)=>{
            return {
            ...oldData,
            invoiceID: '',
            date: '',
            invoiceScan: '',
            value: '',
            valueNoTax: '',
            tax: '',
            dsctValue: '',
            dsctPercent: ''
            }
        })
        setItemsData([])
        setInvoiceItems('')
        refreshInvoiceList()
        } else if (response.status !== 200) {
        console.log((await response).status, response.data)
        }
    }

    function updateInvoice() {
        const data = {...invoiceObject,
                    itemsData: itemsData,
                    command: "updateInvoiceData"}
        axios.put(`http://${IP}:${PORT}`, data)
        .then((response) => {
        if (response.status === 200) {
            loadInvoiceData([invoiceObject.invoiceID, invoiceObject.companyID])
        }
        })
    }

//#---------------------------------------------------------------                        

    function getInvoiceID() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1); // Note: Months are zero-based (0 = January, 11 = December)
        const day = currentDate.getDate();
        const hour = currentDate.getHours();
        const minute = currentDate.getMinutes();
        const dateTime = `${day}-${month}-${year} ${hour}:${minute}`
        const value = `${globalSettings.invoicePrefix} ${dateTime}`
        setInvoiceObject((oldData)=>{
            return {
                ...oldData,
                invoiceID: value
            }
        })
    }

    function getCurrentDate () {
        const d= new Date()
        const date = `${(d.getMonth() + 1)}-${d.getDay()}-${d.getFullYear()}`
        console.log(date)
        setInvoiceObject((oldData)=> {
            return {
                ...oldData,
                date: date
            }
        })
    }

    function changeHandeler(e) {
        const name = e.target.name
        const value = e.target.value
        if (name === 'invoice-number') {setInvoiceObject({...invoiceObject, invoiceID: value})}
        if (name === 'invoice-date') {setInvoiceObject({...invoiceObject, date: value})}
        if (name === 'cancel-button') {setInvoiceObject({...invoiceObject, invoiceScan: ''})}
        if (name === 'item-name') {setItemObject({...itemObject, name: value})}
        if (name === 'item-brand') {setItemObject({...itemObject, brand: value})}
        if (name === 'item-expDate') {setItemObject({...itemObject, expDate: value})}
        if (name === 'unit-option') {setItemObject({...itemObject, unit: value})}
        if (name === 'quantity') {  if (itemObject.price && itemObject.price >= 0) {
                                        setItemObject({...itemObject, 
                                            quantity: value, 
                                            pricePerUnit: (parseFloat(itemObject.price, 2) / parseFloat(value, 2)).toFixed(2)
                                        })
                                    } 
                                    else {setItemObject({...itemObject, quantity: value})} }
    }

    useEffect(() => {
        async function fetchData() {
            try {
            const response = await axios.get('http://127.0.0.1:8080/?getInvoicesList');
            if (response.status === 200) {
                console.log(response.data.data)
                setListOfInvoices(response.data.data);
            } else if (response.status === 201) {
                console.log("Invoice list is empty")
            } else {
                console.log("Error while getting List Of Companies", response.data);
            }
            } catch (error) {
            console.error("An error occurred:", error);
            }
        }
        
        fetchData();
        }, []);

    function addItem() {  // READY
        console.log(invoiceObject)
        if (itemObject.quantity && itemObject.name && itemObject.price) {
            setItemsData((prevItemsData) => {
                const newArray = prevItemsData.concat([itemObject]);
                parseItemsList(newArray);
                return newArray;
            });
            const price = itemObject.price ? itemObject.price : 0
            const priceNoTax = itemObject.priceNoTax ? itemObject.priceNoTax : 0
            const tax = itemObject.tax ? itemObject.tax : 0
            const dsctValue = itemObject.dsctValue ? itemObject.dsctValue : 0
        
            const newValue = invoiceObject.value ? 
                    (parseFloat(invoiceObject.value) + parseFloat(price)).toFixed(2) : price
            const newValueNoTax = invoiceObject.valueNoTax ?
                    (parseFloat(invoiceObject.valueNoTax) + parseFloat(priceNoTax)).toFixed(2) : priceNoTax
            const newTax = invoiceObject.tax ? 
                    (parseFloat(invoiceObject.tax) + parseFloat(tax)).toFixed(2) : tax
            const newDsctValue = invoiceObject.dsctValue ? 
                    (parseFloat(invoiceObject.dsctValue) + parseFloat(dsctValue)).toFixed(2) : dsctValue
            const newDsctPercent = newDsctValue ? 
                    ((parseFloat(newDsctValue) / (parseFloat(newValue) + parseFloat(newDsctValue))) * 100 ).toFixed(2) : ''
            setInvoiceObject((prevObject) => {
                return {
                    ...prevObject, 
                    value: newValue,
                    valueNoTax: newValueNoTax,
                    tax: newTax,
                    dsctValue: newDsctValue,
                    dsctPercent: newDsctPercent
                }
            })                
            setItemObject({
                itemID: '',
                quantity: '',
                unit: globalSettings.unitsOfMeasurement[0], 
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
            q.current.focus();
        }
    }

    function setDiscountValues(obj) {  // READY 
        let price = parseFloat(itemObject.price, 2)
        
        if (obj.target.name === 'item-dsctValue') {
            if (price) {
                const percent = ((parseFloat(obj.target.value) / (parseFloat(price) + parseFloat(obj.target.value))) * 100).toFixed(2)
                const result = forbiden.includes(percent) ? '' : percent           
                setItemObject({...itemObject, dsctValue: obj.target.value, dsctPercent: result})
            } else {
                const value = forbiden.includes(obj.target.value) ? '' : obj.target.value
                setItemObject({...itemObject, dsctValue: value}) 
            }
        }

        if (obj.target.name === 'item-dsctPercent') {
            if (price) {
                const value = ((price / (1 - (parseFloat(obj.target.value) / 100)) - price) ).toFixed(2) 
                const result = forbiden.includes(value) ? '' : value  
                setItemObject({...itemObject, dsctPercent: obj.target.value, dsctValue: result})  
            } else {
                const value = forbiden.includes(obj.target.value) ? '' : obj.target.value
                setItemObject({...itemObject, dsctPercent: value})
            }  
        }   
        }

    function cancelButton () {
        setItemsData([])
        setInvoiceItems([])
        setInvoiceObject((oldData) => {
            return {
            ...oldData,
            invoiceID: '',
            date: '',
            invoiceScan: '',
            value: '',
            valueNoTax: '',
            tax: '',
            dsctValue: '',
            dsctPercent: ''
        }
        })
        setSwitches((oldData) => {
            return {...oldData,
            loadedInvoData: false}
        })
    }

    function clearItemsList() {
        setInvoiceObject((oldData) => {
            return {
                ...oldData,
                value: '',
                valueNoTax: '',
                tax: '',
                dsctvalue: '',
                dsctPercent: ''
            }
        })
        setItemsData([])
        setInvoiceItems([])
    }

    function setPriceValues(obj) {  // READY    
        const name = obj.target.name
        const value = obj.target.value
    
        if (name === 'item-price') {
            const priceNoTax = (parseFloat(value) / parseFloat(globalSettings.TAX)).toFixed(2)
            const pureTax = (parseFloat(value, 2) - parseFloat(priceNoTax, 2)).toFixed(2)
    
            if (itemObject.quantity && itemObject.quantity >= 0) {
                if (itemObject.dsctValue) {
                    const dsctPercent = ((parseFloat(itemObject.dsctValue) / (parseFloat(obj.target.value) + parseFloat(itemObject.dsctValue))) * 100).toFixed(2)
                    setItemObject({
                        ...itemObject, priceNoTax: priceNoTax, 
                                       price: value, 
                                       tax: pureTax,
                                       dsctPercent: dsctPercent,
                                       pricePerUnit: (parseFloat(value, 2) / parseFloat(itemObject.quantity, 2)).toFixed(2)
                                    })
                } else {
                    setItemObject({
                        ...itemObject, priceNoTax: priceNoTax, 
                                       price: value, 
                                       tax: pureTax,
                                       pricePerUnit: (parseFloat(value, 2) / parseFloat(itemObject.quantity, 2)).toFixed(2)
                    })
                }
            } else {
                if (itemObject.dsctValue) {
                    const dsctPercent = ((parseFloat(itemObject.dsctValue) / (parseFloat(obj.target.value) + parseFloat(itemObject.dsctValue))) * 100).toFixed(2)
                    setItemObject({
                        ...itemObject, priceNoTax: priceNoTax, 
                                       price: value, 
                                       tax: pureTax,
                                       dsctPercent: dsctPercent
                                    })
                } else {
                    setItemObject({
                        ...itemObject, priceNoTax: priceNoTax, 
                                       price: value, 
                                       tax: pureTax
                    })
                }
            }
        }

        if (name === 'item-priceNoTax') {
            const price = (parseFloat(value, 2) * parseFloat(globalSettings.TAX, 2)).toFixed(2)
            const pureTax = (parseFloat(price, 2) - parseFloat(value, 2)).toFixed(2)

            if (itemObject.quantity && itemObject.quantity >= 0) {
                if (itemObject.dsctValue) {
                    const dsctPercent =  ((parseFloat(itemObject.dsctValue) / (parseFloat(price) + parseFloat(itemObject.dsctValue))) * 100).toFixed(2)
                    setItemObject({
                        ...itemObject, priceNoTax: value, 
                                       price: price, 
                                       tax: pureTax,
                                       dsctPercent: dsctPercent,
                                       pricePerUnit: (parseFloat(price, 2) / parseFloat(itemObject.quantity, 2)).toFixed(2)
                    })
                } else {
                    setItemObject({
                        ...itemObject, priceNoTax: value, 
                                       price: price, 
                                       tax: pureTax,
                                       pricePerUnit: (parseFloat(price, 2) / parseFloat(itemObject.quantity, 2)).toFixed(2)
                    })
                }
            } else {
                if (itemObject.dsctValue) {
                    const dsctPercent = ((parseFloat(itemObject.dsctValue) / (parseFloat(price) + parseFloat(itemObject.dsctValue))) * 100).toFixed(2)
                    setItemObject({
                        ...itemObject, priceNoTax: value, 
                                       price: price, 
                                       tax: pureTax,
                                       dsctPercent: dsctPercent
                    })
                } else {
                    setItemObject({
                        ...itemObject, priceNoTax: value, 
                                       price: price, 
                                       tax: pureTax
                    })
                }
                    
            }
        }
    }
     
    function photoToPhotoURL(e) {  // READY
        const file = e.target.files[0];

        if (file) {
          const reader = new FileReader();
      
          reader.onload = (e) => {
            setInvoiceObject({...invoiceObject, invoiceScan: e.target.result}); // Store the Data URL in the variable
          };
      
          reader.readAsDataURL(file);
        }
      };










///###--------------------------------------------------------------------------------
  return (
<div className='items-main'>

    <div className='main'>

      <div className='invoice-data'>

        <div className='invoice-id'>
          <input placeholder='Invoice ID'
                  disabled={loadedInvoData}
                  value={!forbiden.includes(invoiceObject.invoiceID) ? invoiceObject.invoiceID : ''} 
                  type='text'
                  name='invoice-number' 
                  onChange={(e) => changeHandeler(e)} />
          <button disabled={loadedInvoData} onClick={getInvoiceID}>Get ID</button>
        </div>

        <div className='invoice-date'>
          <input name='invoice-date' 
                 value={!forbiden.includes(!invoiceObject.date) ? invoiceObject.date : ''}
                 type='date' 
                 placeholder='Date' 
                 onChange={(e)=>changeHandeler(e)}/>
          <button onClick={getCurrentDate}>Current Date</button>
        </div>
        {invoiceObject.invoiceScan ? <button className='cancel' 
                               name='cancel-button'
                               onClick={(e)=>changeHandeler(e)}>Remove File</button> :
                        <input name='invoice-file' 
                               className='invoice-file'
                               accept='image/jpeg image/jpg application/pdf'  
                               onChange={(e) => photoToPhotoURL(e)} 
                               type='file'/>}
      </div>

      <div className='items-details'>
        <div className='column1-items-list'>
        <label>Amount*</label>
        <input  ref={q}
                value={!forbiden.includes(itemObject.quantity) ? itemObject.quantity : ''} 
                className='quantity quantity-input' 
                name='quantity' 
                type='number' 
                onChange={(e)=> changeHandeler(e)}  
                required/>
        </div>

        <div className='dropdown-units'>
            <label>unit</label>
            <select className='dropdown-units-options'> 
                {globalSettings.unitsOfMeasurement.map((item, index) => (
                    <option key={index} 
                            name='unit-option'
                            selected={index === 0 ? 'selected' : ''}
                            value={item}
                            onChange={(e)=>changeHandeler(e)}>
                        {item}
                    </option>
                ))}
            </select>

        </div>

        <div className='column2-items-list'>
        <label>Item name*</label>
        <input  value={!forbiden.includes(itemObject.name) ? itemObject.name : ''} 
                name='item-name' 
                type='text' 
                onChange={(e)=>changeHandeler(e)} 
                required/>
        </div>

        <div className='column3-items-list'>
        <label>Item brand</label>
        <input  value={!forbiden.includes(itemObject.brand) ? itemObject.brand : ''} 
                name='item-brand' 
                type='text' 
                onChange={(e)=> changeHandeler(e)}/>
        </div>

        <div className='column4-items-list'>
        <label>exp. date</label>
        <input  value={itemObject.expDate ? itemObject.expDate : ''}
                name='item-expDate'
                type='date' 
                onChange={(e)=> changeHandeler(e)}/>  
        </div>

        <div className='column5-items-list'>
        <label>Price*</label>
        <input value={!forbiden.includes(itemObject.price) ? itemObject.price : ''} 
                name='item-price' 
                type='text' 
                onChange={(e) => setPriceValues(e)}  
                required/>
        </div>

        <div className='column6-items-list'>
        <label>Price - tax</label>
        <input value={!forbiden.includes(itemObject.priceNoTax) ? itemObject.priceNoTax : ''} 
                name={'item-priceNoTax'} 
                type='text' 
                onChange={(e) => setPriceValues(e)} />
        </div>

        <div className='column7-items-list'>
        <p>Tax</p>
        <input id='TAX' 
                type='text' 
                disabled={true}
                placeholder={forbiden.includes(itemObject.tax) ? '' : itemObject.tax}/>
        </div>

        <div className='column8-items-list'>
        <label>dsct $</label>
        <input  value={itemObject.dsctValue} 
                name={'item-dsctValue'} 
                type='text' 
                onChange={(e) => setDiscountValues(e)} />
        </div>

        <div className='column9-items-list'>
        <label>dsct %</label>
        <input value={!forbiden.includes(itemObject.dsctPercent) ? itemObject.dsctPercent : ''} 
                name='item-dsctPercent' 
                type='text' 
                onChange={(e) => setDiscountValues(e)} />
        </div>

        <div className='column10-items-list'>
        <p>$/UOM</p>
        <input value={!forbiden.includes(itemObject.pricePerUnit) ? itemObject.pricePerUnit : ''} 
                disabled={true}
                type='text'
                id='price-per-unit'/>
        </div>

        <div className='column11-items-list'>
        <button onClick={addItem}>add</button>
        </div>
      </div>

      <div>
        <div className='list-of-invoice-items'>
            {invoiceItems ?
            <div className='items-list-row items-list-headers'>
            <p className='indexNo'>#</p>
            <p className='quantity'>quantity</p>
            <p className='name'>name</p>
            <p className='brand'>brand</p>
            <p className='exp-date'>exp.date</p>
            <p className='price'>price</p>
            <p className='price'>price-tax</p>
            <p className='tax'>tax</p>
            <p className='discount-value'>dsct $</p>
            <p className='discount-percent'>dsct %</p>
            <p className='price-per-unit'>$/u.o.m</p>
            <p className='rubishbin-list'></p>    
            </div> :
            <div></div>}
            {invoiceItems}
        </div>

        <div className='lower-section'>
            <div className='lower-section-buttons'> 
                {!loadedInvoData ? 
                    <button onClick={saveInvoice} disabled={!loadedCompData}>Save</button> :
                    <button onClick={() => updateInvoice(invoiceObject.invoiceID)}>Update</button>}
                {!loadedInvoData ?
                    <button onClick={clearItemsList}
                            style={{backgroundColor: 'red'}}>Clear</button> :
                    <button onClick={cancelButton}
                            style={{backgroundColor: 'red'}}>CANCEL</button>}
            </div>

            <div className='invoice-sumary'>
                <div>
                    <div className='lower-section-results'>
                        <label>discount value:</label>
                        <p>{invoiceObject.dsctValue}{invoiceObject.dsctValue && "$"}</p>
                    </div>
                    <div className='lower-section-results'>
                        <label>discount percent:</label>
                        <p>{invoiceObject.dsctPercent}{invoiceObject.dsctPercent && "%"}</p>
                    </div>
                </div>
                <div>
                    <div className='lower-section-results'>
                        <label><b>Total price:</b></label>
                        <p><b>{invoiceObject.value}{invoiceObject.value && "$" }</b></p>
                    </div>
                    <div className='lower-section-results'>
                        <label>Total price - tax:</label>
                        <p>{invoiceObject.valueNoTax}{invoiceObject.valueNoTax && "$"}</p>
                    </div>
                    <div className='lower-section-results'>
                        <label>total tax:</label>
                        <p>{invoiceObject.tax}{invoiceObject.tax && "$"}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    </div>

    <InvoiceList 
          listOfInvoices={listOfInvoices} setListOfInvoices={setListOfInvoices}
          refreshInvoiceList={refreshInvoiceList}
          loadInvoiceData={loadInvoiceData}/>
  
    </div>
  )
}

export default ItemsDetails