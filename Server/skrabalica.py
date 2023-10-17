from typing import NewType
from dataclasses import dataclass
from Database import DB_proc_meni
from Database.DB_models import Items


##### Dynamically instancing class #####
class MyClass:
    def __init__(self, value):
        self.value = value

# Dictionary to store instances
instances = {}

# Create instances dynamically and store them in the dictionary
for i in range(5):
    variable_name = f"instance_{i}"  # Generating variable names like "instance_0", "instance_1", ...
    instances[variable_name] = MyClass(i)

# Access instances from the dictionary
for variable_name, instance in instances.items():
    print(f"{variable_name}: {instance.value}")




class ActiveItems:
    def __init__(self, id, item, amount, pricePerUnit):
        self.id = id
        self.item = item
        self.amount = amount
        self.pricePerUnit = pricePerUnit

    def update_amount(self, amount):
        # null the amount of the id of current item in DB,
        update:Items = DB_proc_meni.GetItems(old_id = self.id)
        self.id = update.ID
        self.amount = update.amount - amount

    def use_item(self, amount):
        # Reduce used amount from actual amount
        # If reduction is greater than actual amount, update new amount from stock and reduce the difference 
        if (self.amount <= amount):
            self.update_amount(amount-self.amount)
        else:
            self.amount -= amount
        

class Ingredient:
    def __init__ (self, name, quantity):
        self.name = name
        self.quantity = quantity

    
class Group:
    def __init__(self, name:str, meni:bool):
        self.name:str      = name
        self.meni:bool  = meni
        self.members: list = []

    def add_item(self, item:object):
        pass

    def remove_item(self, item:object):        
        pass


