from sqlalchemy import select, insert, delete, update
from sqlalchemy.orm import sessionmaker
from .DB_models import *
from .DB_engines import engine


session_factory = sessionmaker(bind=engine)

class Populate:
    @classmethod
    def get_list_of_items(cls):
        """Returns DISTINCT 'names' from table 'Items'"""
        session = session_factory()
        list_of_items = session.execute(
            select(Items.name)
            .distinct()
        )
        for row in list_of_items:
            return row

    @classmethod
    def populate_active_items(cls, name):
        """Returns oldest items of requested name whose amount is not 0"""
        session = session_factory()
        item = session.scalars(
            select(
                Items.ID,
                Items.name,
                Items.amount,
                Items.pricePerUnit)
                .join(Invoices)
                .filter(Items.name.in_([name]), Items.amount != 0)
                .order_by(Invoices.date)
            ).first()
        return item
    
    @classmethod
    def populate_ingredients(cls):
        session = session_factory()
        ingredients = session.scalars(
            select(Ingredients)
            .order_by(Ingredients.name)
        ).all()
        return ingredients
    
    @classmethod
    def populate_recipes(cls):
        session = session_factory()
        recipes = session.scalars(
            select(Recipe)
            .order_by(Recipe.name)
        ).all()
        return recipes
    
    @classmethod
    def populate_promotions(cls):
        session = session_factory()
        promotions = session.scalars(
            select(Promotion)
            .order_by(Promotion.name)
        ).all()
        return promotions
    
    @classmethod
    def populate_groups(cls):
        session = session_factory()
        groups = session.scalars(
            select(Group)
            .order_by(Group.name)
        ).all()
        return groups
    


class POST:    
    @classmethod
    def create_ingredient(cls, data):
        session = session_factory()
        name, item_name, used_amount, \
        production_cost, sale_price, menu = data

        new_ingredient = Ingredients(
            name            = name,
            item_name       = item_name,
            used_amount     = used_amount,
            production_cost = production_cost,
            sale_price      = sale_price,
            menu            = menu
        )
        session.add_all([new_ingredient])
        try:
            session.commit()
            return (200, "Ingredient created successfully")
        except:
            session.rollback()
            return (401, "Failed to create ingredient")
        finally:
            session.close()

    @classmethod
    def create_recipe(cls, data):
        session = session_factory()
        name, ingredient_list, production_cost, sale_price, \
        recipe_amount, portions, menu = data

        new_recipe = Ingredients(
            name            = name,
            ingredient_list = ingredient_list,
            production_cost = production_cost,
            sale_price      = sale_price,
            recipe_amount   = recipe_amount,
            portions        = portions,
            menu            = menu
        )
        session.add_all([new_recipe])
        try:
            session.commit()
            return (200, "Recipe created successfully")
        except:
            session.rollback()
            return (401, "Failed to create recipe")
        finally:
            session.close()

    @classmethod
    def create_promotion(cls, data):
        session = session_factory()
        name, production_cost, sale_price, items_list, menu = data

        new_promotion = Ingredients(
            name            = name,
            production_cost = production_cost,
            sale_price      = sale_price,
            items_list      = items_list,
            menu            = menu
        )
        session.add_all([new_promotion])
        try:
            session.commit()
            return (200, "Promotion created successfully")
        except:
            session.rollback()
            return (401, "Failed to create promotion")
        finally:
            session.close()

    @classmethod
    def create_group(cls, data):
        session = session_factory()
        name, members, menu = data

        new_group = Ingredients(
            name            = name,
            members         = members,
            menu            = menu
        )
        session.add_all([new_group])
        try:
            session.commit()
            return (200, "Promotion created successfully")
        except:
            session.rollback()
            return (401, "Failed to create promotion")
        finally:
            session.close()


class PUT:
    @classmethod
    def update_ingredient(cls, data):
        session = session_factory()
        name, item_name, used_amount, production_cost, sale_price, menu = data
        
        update = session.execute(
                    select(Ingredients)
                    .filter(Ingredients.name == name)
                ).scalar_one()
        update.name = name
        update.item_name = item_name
        update.used_amount = used_amount
        update.production_cost = production_cost
        update.sale_price = sale_price
        update.menu = menu

        try:
            session.commit()
            return (200, "Ingredient updated successfully")
        except:
            session.rollback()
            return (401, "Failed to update ingredient")
        finally:
            session.close()

    @classmethod
    def update_recipe(cls, data):
        session = session_factory()
        name, ingredients_list, production_cost, sale_price, recipe_amount, portion, menu = data

        update = session.execute(
                    select(Recipe)
                    .filter(Recipe.name == name)
                ).scalar_one()
        update.name            = name
        ingredients_list       = ingredients_list
        update.production_cost = production_cost
        update.sale_price      = sale_price
        update.recipe_amount   = recipe_amount
        update.portions        = portion
        update.menu            = menu

        try:
            session.commit()
            return (200, "Recipe updated successfully")
        except:
            session.rollback()
            return (401, "Failed to update recipe")
        finally:
            session.close()

    @classmethod
    def update_promotion(cls, data):
        session = session_factory()
        name, production_cost, sale_price, items_list, menu = data

        update = session.execute(
            select(Promotion)
            .filter(Promotion.name == name)
        ).scalar_one()
        update.name = name
        update.production_cost = production_cost
        update.sale_price = sale_price
        update.items_list = items_list
        update.menu = menu

        try:
            session.commit()
            return (200, "Recipe updated successfully")
        except:
            session.rollback()
            return (401, "Failed to update recipe")
        finally:
            session.close()

    @classmethod
    def update_group(cls, data):
        session = session_factory()
        name , members, menu = data

        update = session.execute(
            select(Group)
            .filter(Group.name == name)
        ).scalar_one()
        update.name = name
        update.members = members
        update.menu = menu

        try:
            session.commit()
            return (200, "Recipe updated successfully")
        except:
            session.rollback()
            return (401, "Failed to update recipe")
        finally:
            session.close()


class DELETE:    
    @classmethod
    def delete_ingredient(cls, name):
        session = session_factory()
        session.execute(
            delete(Ingredients)
            .where(Ingredients.name == name)
        )
        try:
            session.commit()
            return (200, "Ingredient deleted successfully")
        except:
            session.rollback()
            return (401, "Failed to delete ingredient")

    @classmethod
    def delete_recipe(cls, name):
        session = session_factory()
        session.execute(
            delete(Recipe)
            .where(Recipe.name == name)
        )
        try:
            session.commit()
            return (200, "Recipe deleted successfully")
        except:
            session.rollback()
            return (401, "Failed to delete recipe")

    @classmethod
    def delete_promotion(cls, name):
        session = session_factory()
        session.execute(
            delete(Promotion)
            .where(Promotion.name == name)
        )
        try:
            session.commit()
            return (200, "Promotion deleted successfully")
        except:
            session.rollback()
            return (401, "Failed to delete promotion")

    @classmethod
    def delete_group(cls, name):
        session = session_factory()
        session.execute(
            delete(Group)
            .where(Group.name == name)
        )
        try:
            session.commit()
            return (200, "Group deleted successfully")
        except:
            session.rollback()
            return (401, "Failed to delete group")



Populate.get_list_of_items()