import React from 'react'
import '../../../css/options/menu-components/ingredients.css'

function Ingredients() {
  return (
    <div className='ing-comp-main'>
        <div className='ing-comp-column1'>
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
            <label htmlFor='price-ing'>Price</label>
            <input id='price-ing' type='text' />
          </div>
        </div>

        <div className='ing-comp-column2'>
          <div>
            <label htmlFor='cost-ing'>Production cost: </label>
          </div>
        </div>

        <div>
          <button>Cancel</button><br/>
          <button>&lt;--</button><br/>
          <button>--&gt;</button><br/>
          <button>Update</button><br/>
          <label htmlFor='recipe-checkbox' >Update:</label>
          <input id='recipe-checkbox' type='checkbox'/>
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
            <label>active</label><br/>
            {}
          </div>
        </div>
    </div>

    </div>
  )
}

export default Ingredients