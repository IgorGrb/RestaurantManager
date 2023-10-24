import React, {useState} from 'react'
import '../../../css/options/menu-components/recipes.css'

function Recipes() {

  const [ listOfIngredients, setListOfIngredients ] = useState([])

  function removeIngredient() {

  }

  function makeListOfIngredients(list) {
    setListOfIngredients(
      list.map((value, index) => (
        <div>
          <p>{value.name}</p>
          <p>{value.amount}</p>
          <p>{value.pricePerUnit * value.amount}</p>
          <img alt=''
               src={require('../../../images/cancel-red.ico')}/>
        </div>
      )))}
  
  return (
    <div className='recipe-comp-main'>
        <div className='recipe-comp-column1'>
          <p>Recipes</p>
          <div>
            <label htmlFor='name-recipe'>Name: </label>
            <input id='name-recipe' type='text'/> 
          </div>
          <div>
            <label htmlFor='price-recipe'>Price: </label>
            <input id='price-recipe'/>
          </div>
          <div>
            <label htmlFor='yealds-recipe'>Yealds: </label>
            <input id='yealds-recipe'/>
          </div>
          <div>
            <label htmlFor='recipe-cost'>Cost: </label> 
            <input id='recipe-cost' disabled type='text' placeholder='0.00$' />
          </div>
        </div>

        <div className='recipe-comp-column2'>
          <div className='recipe-list'>
            {listOfIngredients}
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
            <label>menu</label>
            {}
          </div>
        </div>
    </div>

    </div>
  )
}

export default Recipes