from decimal import Decimal
from typing import List
import asyncio
import pickle
from enum import Enum, auto
from database.DB_models import Items
from database import DB_proc_menu


class Units(Enum):
    kg: str   = auto()
    L: str    = auto()
    unit: str = auto()


class Menu:
    list_of_items_names  = []
    list_of_active_items = []
    list_of_ingredients  = []
    list_of_recipes      = []
    list_of_promotions   = []
    list_of_groups       = []

    @classmethod
    def get_list_of_items_names(cls):
        """ 
        List for local use
        Get list of unique items from DB Items (Items.name) 
        Will be used to suggest inputs in ItemsDetails/<input>/name 
        """
        cls.list_of_items_names = DB_proc_menu.Populate.get_list_of_items()
        pass

    @classmethod
    def populate_active_items(cls):
        """For global use"""
        async def start():
            async def add_to_list(name):
                item = await DB_proc_menu.Populate.populate_active_items(name)
                cls.list_of_active_items.append(ActiveItem(**item))
            tasks = [add_to_list(name) for name in cls.list_of_items_names]
            await asyncio.gather(*tasks)
        asyncio.run(start())

    @classmethod
    def populate_ingredients(cls):
        """For global use""" 
        # Should return list
        cls.list_of_ingredients = DB_proc_menu.Populate.populate_ingredients()

    @classmethod
    def populate_recipes(cls):
        """For global use"""
        cls.list_of_recipes = DB_proc_menu.Populate.populate_recipes()

    @classmethod
    def populate_promotions(cls):
        """For global use"""
        cls.list_of_promotions = DB_proc_menu.Populate.populate_promotions()

    @classmethod
    def populate_groups(cls):
        """For global use"""
        cls.list_of_groups = DB_proc_menu.Populate.populate_groups()


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
        update:Items = DB_proc_menu(old_id = self.id)
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



class POST:    
    @classmethod
    def create_ingredient(cls, data):
        response = DB_proc_menu.POST.create_ingredient(data)
        return response

    @classmethod
    def create_recipe(cls, data):
        response = DB_proc_menu.POST.create_recipe(data)
        return response

    @classmethod
    def create_promotion(cls, data):
        response = DB_proc_menu.POST.create_promotion(data)
        return response

    @classmethod
    def create_group(cls, data):
        response = DB_proc_menu.POST.create_group(data)
        return response


class PUT:
    @classmethod
    def update_ingredient(cls, data):
        response = DB_proc_menu.PUT.update_ingredient(data)
        return response

    @classmethod
    def update_recipe(cls, data):
        response = DB_proc_menu.PUT.update_recipe(data)
        return response

    @classmethod
    def update_promotion(cls, data):
        response = DB_proc_menu.PUT.update_promotion(data)
        return response

    @classmethod
    def update_group(cls, data):
        response = DB_proc_menu.PUT.update_group(data)
        return response


class DELETE:    
    @classmethod
    def delete_ingredient(cls, data):
        response = DB_proc_menu.DELETE.delete_ingredient(data)
        return response

    @classmethod
    def delete_recipe(cls, data):
        response = DB_proc_menu.DELETE.delete_recipe(data)
        return response

    @classmethod
    def delete_promotion(cls, data):
        response = DB_proc_menu.DELETE.delete_promotion(data)
        return response

    @classmethod
    def delete_group(cls, data):
        response = DB_proc_menu.DELETE.delete_group(data)
        return response
