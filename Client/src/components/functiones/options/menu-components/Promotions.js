import React, {useState} from 'react'
import '../../../css/options/menu-components/promotions.css'

function Promotions() {
  
  const [ listOfPromo, setListOfPromo ] = useState([])


  return (
    <div className='promo-comp-main'> 
        <div className='promo-comp-column1'>
          <p>Promotions</p>
          <div>
            <label htmlFor='name-promo'>Name: </label>
            <input id='name-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='price-promo'>Price: </label>
            <input id='price-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='cost-promo'>Cost</label>
            <input id='cost-promo' type='text' disabled placeholder='0.00$'/>
          </div>
        </div>

        <div className='promo-comp-column2'>
          <div className='recipe-list'>
            {listOfPromo}
          </div>

          <div className='recipe-ing-list-botoom'>
            <button>Modify</button>
          </div>
        </div>

        <div>
          <button>Cancel</button><br/>
          <button>&lt;--</button><br/>
          <button>--&gt;</button><br/>
          <button>Update</button><br/>
          <label htmlFor='promo-checkbox' >Update:</label>
          <input id='promo-checkbox' type='checkbox'/>
        </div>

        <div className='list-container'>
        <div>
          <div>
            <input type='search' placeholder='Search...'/>
            <button>Menu</button>
          </div>
          <div className='list-element'>
            <label>name</label>
            <label>amount</label>
            <label>menu</label>
            {}
          </div>
        </div>
    </div>

    </div>
  )
}

export default Promotions