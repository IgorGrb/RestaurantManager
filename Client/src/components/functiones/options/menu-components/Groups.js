import React, {useState} from 'react'
import '../../../css/options/menu-components/groups.css'

function Groups() {

  const [ listOfGroup, setListOfGroup ] = useState([])


  return (
    <div className='group-comp-main'>
        <div className='group-comp-column1'>
          <p>Groups</p>
          <div>
            <label htmlFor='name-promo'>Name: </label>
            <input id='name-promo' type='text'/>
          </div>
        </div>

        <div className='group-comp-column2'>
          <div className='group-list'>
          <p>Members: </p>
            {listOfGroup}
          </div>

          <div>
            <button>Modify</button>
          </div>
        </div>

        <div>
          <button>Cancel</button><br/>
          <button>&lt;--</button><br/>
          <button>--&gt;</button><br/>
          <button>Update</button><br/>
          <label htmlFor='group-checkbox' >Update:</label>
          <input id='group-checkbox' type='checkbox'/>
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

export default Groups