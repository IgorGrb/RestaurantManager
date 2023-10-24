import React from 'react'
import Ingredients from './menu-components/Ingredients'
import Recipes from './menu-components/Recipes'
import Promotions from './menu-components/Promotions'
import Groups from './menu-components/Groups'
import BasicStats from './menu-components/BasicStats'
import '../../css/options/menu.css'


function Menu() {
  return (
    <main className='menu-option'>
      <div className='menu-create'>
        <Ingredients />
        <Recipes />
        <Promotions />
        <Groups />
      </div>

      <div className='basic-stats-main'>
        <BasicStats />
      </div>
    </main>
  )
}

export default Menu