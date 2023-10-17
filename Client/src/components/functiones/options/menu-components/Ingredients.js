import React from 'react'
import '../../../css/options/menu-components/ingredients.css'

function Ingredients() {
  return (
    <div className='ing-comp-main'>
        <div className='ing-comp-fields'>
          <p>Ingredients</p>
          <div>
            <label htmlFor='name-ing'>Name: </label>
            <input id='name-ing' type='text' />
          </div>
          <div>
            <label htmlFor='item-name-ing'>Item name: </label>
            <input id='item-name-ing' type='text'/>
          </div>
          <div>
            <label htmlFor='amount-ing'>Amount: </label>
            <input id='amount-ing' type='text'/>
          </div>
          <div>
            <label htmlFor='cost-ing'>Cost: </label>
            <input id='cost-ing' type='text'/>
          </div>
          <div>
            <label htmlFor='price-ing'>Price</label>
            <input id='price-ing' type='text' />
          </div>
          <div>
            <label>Add to menu</label>
            <input id='menu-ing' type='checkbox'/>
          </div>
        </div>

        <div>

        </div>
    </div>
  )
}

export default Ingredients