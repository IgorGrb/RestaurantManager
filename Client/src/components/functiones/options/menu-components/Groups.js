import React from 'react'
import '../../../css/options/menu-components/groups.css'

function Groups() {
  return (
    <div className='group-comp-main'>
        <div className='group-comp-fields'>
          <p>Groups</p>
          <div>
            <label htmlFor='name-promo'>Name: </label>
            <input id='name-promo' type='text'/>
          </div>
          <div>
            <label htmlFor='members-group'>Members: </label>
            <input id='members-group' type='text'/>
          </div>
          <div>
            <label htmlFor='menu-group'>Add to menu: </label>
            <input id='menu-group' type='checkbox'/>
          </div>
        </div>

        <div>
            
        </div>
    </div>
  )
}

export default Groups