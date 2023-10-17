from decimal import Decimal
from typing import List
from enum import Enum, auto

import sys
print("#######################################################")
print(sys.path)
print("#######################################################")

from database.DB_proc_meni import GetItems
from database.DB_models import Items


class Units(Enum):
    kg: str   = auto()
    L: str    = auto()
    unit: str = auto()



def populate_active_items():
    """For global use"""
    pass

def populate_ingredients():
    """For global use"""
    pass

def populate_recipes():
    """For global use"""
    pass

def populate_promotions():
    pass

def populate_groups():
    """For global use"""
    pass

def get_list_of_items():
    """ 
    List for local use
    Get list of unique items from DB Items (Items.name) 
    Will be used to suggest inputs in ItemsDetails/<input>/name 
    """
    pass


class ActiveItem:
    def __init__(self, item: Items):
        """
        id -> ID of active item
        item -> name of active item
        amount -> total available amount of active item
        pricePerUnit -> price per unit (unit, kg, L) of active item
        """
        self.id = item.ID
        self.name = item.name
        self.amount = item.amount
        self.pricePerUnit = item.pricePerUnit

    def update_amount(self, amount):
        """ 
        null the amount of the id of current item in DB 
        Loads next available Item of same name
        """
        update:Items = GetItems(old_id = self.id)
        self.id = update.ID
        self.amount = update.amount - amount

    def use_item(self, amount):
        """
        Reduce used amount from actual amount
        If reduction is greater than actual amount, update new amount from stock and reduce the difference 
        """
        if (self.amount <= amount):
            self.update_amount(amount-self.amount)
        else:
            self.amount -= amount
    


class MenuStatus:
    def __init__ (self):
        self.menu: bool = False

    def menu_status_change(self):
        """Add/Remove Ingredient to Menu"""
        self.menu = not self.menu


class Ingredient(MenuStatus):
    def __init__ (self, name, item:ActiveItem, used_amount:Decimal, price:Decimal = False) -> object:
        self.name = name  # Ime sastojka
        self.item_name = item.name
        self.used_amount:Decimal = Decimal(used_amount)
        self.production_cost:Decimal = Decimal(item.pricePerUnit) * self.used_amount
        self.sale_price:Decimal
        super().__init__()


class Recipe(MenuStatus):
    def __init__ (self, name, sale_price:str|bool = False) -> object:
        self.name:str = name
        self.list_of_ingredients: list = []
        self.production_cost:Decimal 
        self.sale_price:Decimal|bool = Decimal(sale_price)
        super().__init__()

        self.recipe_amount:Decimal
        self.portions:Decimal


    def calculate_value(self) -> None:
        """Calculate value of recipe by suming up values of all ingredients"""
        
        list_of_values = [Decimal(ing.value) for ing in self.list_of_ingredients]
        self.value = sum(list_of_values)


    def add_ingredient(self, ingredient:Ingredient) -> None:
        """Add existing ingredient and calculates new value of recipe"""
        
        self.list_of_ingredients.append({f"{ingredient.name}": ingredient})
        self.calculate_value()


    def create_ingredient(self, name:str, item:ActiveItem, amount:Decimal) -> None:
        """Create a new ingredient, add it to list of ingredients and calculate new value of recipe"""
        
        ingredient = Ingredient(name, item, amount)
        self.list_of_ingredients.append({f"{ingredient.name}": ingredient})
        self.calculate_value()


    def set_portions(self):
        pass


class Promotion(MenuStatus):
    def __init__(self, name, sale_price) -> object:
        self.name:          str     = name
        self.production_cost:         Decimal 
        self.sale_price:         Decimal = sale_price
        self.list_of_items: list    = []
        super().__init__()

    def calculate_value(self):
        list_of_values = [obj.value for obj in self.list_of_items]
        self.value = sum(list_of_values)
        pass

    def add_item(self, item: Ingredient | Recipe):
        self.list_of_items.append({f"{item.name}": item})

    
class Group(MenuStatus):
    def __init__(self, name:str, meni:bool) -> object:
        self.name:str      = name
        self.members: List[
            ActiveItem, 
            Ingredient, 
            Recipe, 
            Promotion] = []
        super().__init__()

    def add_item(self, item:ActiveItem|Ingredient|Recipe|Promotion) -> None:
        self.members.append({f"{item.name}": item})

    def remove_item(self, name:str):
        self.members.pop(name)

