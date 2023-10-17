import React from 'react'
import Ingredients from './menu-components/Ingredients'
import Recipes from './menu-components/Recipes'
import Promotions from './menu-components/Promotions'
import Groups from './menu-components/Groups'
import '../../css/options/menu.css'


function Menu() {
  return (
    <main className='menu-option'>
        <Ingredients />
        <Recipes />
        <Promotions />
        <Groups />
    </main>
  )
}

export default Menu