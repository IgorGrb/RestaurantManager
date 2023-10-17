import React from 'react'
import '../../../css/options/menu-components/promotions.css'

function Promotions() {
  return (
    <div className='promo-comp-main'> 
        <div className='promo-comp-fields'>
          <p>Promotions</p>
          <div>
            <label htmlFor='name-promo'>Name: </label>
            <input id='name-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='production-cost-promo'>Production cost: </label>
            <input id='production-cost-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='price-promo'>Price: </label>
            <input id='price-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='items-list-promo'>List of items: </label>
            <input id='items-list-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='menu-promo'>Add to menu: </label>
            <input id='menu-promo' type='checkbox'/>
          </div>
        </div>

        <div>

        </div>
    </div>
  )
}

export default Promotions