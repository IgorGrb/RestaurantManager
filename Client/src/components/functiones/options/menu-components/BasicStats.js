import React, {useState} from 'react'
import '../../../css/options/menu-components/basicstats.css'

function BasicStats() {

    const type = {
        INGREDIENT: "Ingredient",
        RECIPE: "Recipe",
        PROMOTION: "Promotion",
        GROUP: "Group"
    }

    const recipe = {
        type: "Recipe",
        name: "Margarita",
        yealds: 1,
        list_of_items: [
            { cost: 800 },
            { cost: 300 },
            { cost: 250 }
        ],
        cost: function () {
            return recipe.list_of_items.reduce((total, item) => total + item.cost, 0);
        },
        price: 7500
    };
    
    const ingredient = {
        type: "Ingredient",
        name: "Mozzarela pizza 32cm",
        amount: "0.150",
        cost: 975,
        price: 1500,
        item: {
            name: "Mozzarela",
            price: "6500",
            nextStock: "6400",
            avgPrice: "6350",
            stock: "2.36kg",
        }
    }

    const [selectedItem] = useState(recipe)
    
    console.log(selectedItem.cost)

  return (
    <div className='basic-stats'>
        <h3>{selectedItem.name}</h3><br/>
            { selectedItem.type === type.INGREDIENT &&
                <div className='basic-stats-info'>
                    <div>
                        <label>Item name:</label>
                        <h4>{selectedItem.item.name}</h4><br/>
                        <label>Amount:</label>
                        <h4>{selectedItem.amount}</h4><br/>
                        <label>Cost:</label>
                        <h4>{selectedItem.cost}</h4>
                        {selectedItem.price ? 
                            <>
                                <label>Sale price</label>
                                <h4>{selectedItem.price}</h4>
                                <label>Profit BRUTO:</label> 
                                <h4>{selectedItem.price - selectedItem.cost}</h4>
                                <label>Profit NETO:</label>
                                <h4>{((selectedItem.price - selectedItem.cost)/100)*(100-19)}</h4>
                            </> :
                            ''}
                    </div>

                    <div>Right Side</div>
                </div>
            }
            { selectedItem.type === type.RECIPE &&
                <div className='basic-stats-info'>
                    <div>
                        <label>Yealds:</label>
                        <h4>{selectedItem.yealds}</h4><br/>
                        <label>Cost:</label>
                        <h4>{selectedItem.cost()}</h4><br/>
                        <label>Price:</label>
                        <h4>{selectedItem.price}</h4>
                        <label>Profit BRUTO:</label>
                        <h4>{selectedItem.price - selectedItem.cost()}</h4>
                        <label>Profit NETO:</label>
                        <h4>{((selectedItem.price - selectedItem.cost())/100)*(100-19)}</h4>
                    </div>

                    <div></div>
                </div>
            }


    </div>
  )
}

export default BasicStats