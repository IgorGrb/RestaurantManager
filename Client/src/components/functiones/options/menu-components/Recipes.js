import React from 'react'

function Recipes() {
  return (
    <div className='recipe-comp-main'>
        <div className='recipe-comp-fields'>
          <p>Recipes</p>
          <div>
            <label htmlFor='name-recipe'>Name: </label>
            <input id='name-recipe' type='text'/> 
          </div>
          <div>
            <label htmlFor='ing-list-recipe'>List of ingredients: </label>
            <input id='ing-list-recipe' type='text'/>
          </div>
          <div>
            <label htmlFor='cost-recipe'>Cost: </label>
            <input id='cost-recipe'/>
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
            <label htmlFor='portions-recipe'>Portions: </label>
            <input id='portions-recipe'/>
          </div>
          <div>
            <label htmlFor='menu-recipe'>Menu: </label>
            <input id='menu-recipe' type='checkbox'/>
          </div>
        </div>

        <div>

        </div>
    </div>
  )
}

export default Recipes