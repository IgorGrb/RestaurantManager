import json
import datetime as dt
from database import DB_proc_invoices
from core_proccesses import CP_users
from core_proccesses import CP_invoices
from core_proccesses import CP_menu


# Fokus mora biti da se prvo osposobe sve klase i funkcije do prodaje 
# Kada osposobimo da moze da se prodaje (da prodaja oduzima iz baze podataka) onda cemo da vidimo sta dalje
# Bitno je da imamo standardizovan INPUT i OUTPUT za svaku funkciju i metodu
# Svi podaci koji ulaze u fajl moraju biti str, int, float ili binary. (bez jpeg, jpg, mp3 itd...)


####### ERROR HANDLEING #######
class   Error_collector:    
    # svaka operacija koja moze da fail-uje treba da ima tip greske i podatak koji je izazvao gresku
    @staticmethod
    def collect_error(error):
        with open("ERROR LIST!!!.txt", "a")as txt:
            time = dt.datetime.utcnow().strftime("%d-%m-%Y %H:%M")
            txt.write(f"{error} --> {str(time)} + \n") # + time     Importovati Time module
            txt.close()

######## USER CLASSES #########
# Osmisliti kako da tip usera otkljucava ili zakljucava dostupne opcije

class Admin():
    def __init__(self, username):
        super().__init__(username)
        self.menu_options = [Statistic_Option, Group_Option, Actions_Options]
        """Can create Manager, Admin and Sales"""

class Manager():
    def __init__(self, username):
        super().__init__(username)
        self.menu_options = [Statistic_Option, Group_Option, Actions_Options]

        """Can create Manager and Sales"""

class Sales():
    """Cannot create Users"""
    def __init__(self, user:object):
        self.username:str = user.username
        self.access_list:list = user.accessList
        self.email:str = user.email
        self.cash:float = 0
        self.shift_open:tuple # If shift is open, enable sales
        self.shift_close:int
        self.sales_list:list   # list of IDs of sales [{"recept1": ""}]

    def open_shift(self):
        if self.shift_open[1]:
            return "Shift is open"
        self.shift_open = (dt.datetime.utcnow().strftime("%d-%m-%Y %H:%M"), True)

    def close_shift(self):
        self.shift_close = dt.datetime.utcnow().strftime("%d-%m-%Y %H:%M")

    def add_to_bill(self):
        pass

    def remove_from_bill(self):
        pass
        """
        Need to save to TABLE shift 
        Values (username, self.shift_open, self.cash, self.sales_list, self.shift_closed)
        """
        pass

    def sell(self):
        """
        Need to make logic to save to database table sales (what, quantity, time, useername)
        Need to add sales to self.sales_list
        Need to add sale price to self.cash
        """
        pass

###### KORISNICKE OPCIJE ######

class UserProcessorRouter:    
    @classmethod
    def login(cls, data): # --> Main.login()
        status, user = CP_users.Users.login(data)

        if status == 200:
            name = user.username
            obj  = Sales(user=user)
            if user.position == "Sales":
                Main_Process.session_list.update({name: obj})
                obj = {"Name": user.username,
                        "Position": user.position,
                        "AccessList": json.loads(user.accessList)}
                response = json.dumps(obj)
                return (200, response)
            
            elif user.position == "Admin":
                Main_Process.session_list.update({name: obj})  # Need finnishing
                return (200, user)
            
            elif user.position == "Manager":
                Main_Process.session_list.update({name: obj}) # Need finnishing
                return (200, user)
            
            else:
                return (500, 'Internal server error')
        else:
            return (status, user)

    @classmethod
    def create_user(cls, data):
        response = CP_users.Users.create_user(data)
        return response
        
class InvoiceProcessorRouter:
    @classmethod
    def get_company_list(cls):
        pass

    @classmethod
    def get_invoice_list(cls):
        pass

    @classmethod
    def save_company_data(cls, data):
        pass

    @classmethod
    def load_company_data(cls, data):
        pass

    @classmethod
    def save_invoice_data(cls, data):
        pass

    @classmethod
    def load_invoice_data(cls, data):
        pass

    @classmethod
    def update_company_data(cls, data):
        pass

    @classmethod
    def update_company_comment(cls, data):
        pass

    @classmethod
    def update_invoice_data(cls, data):
        pass

    @classmethod
    def delete_company(cls, data):
        pass

    @classmethod
    def delete_invoice(cls, data):
        pass

class MenuProcessorRouter:
    pass

class Sales_Option:  # (sales)
    """ 
    Dodavanje na racun, skidanje sa racuna, naplata racuna, storniranje naplate(manager)
    Personalizacija recepta pre prodaje (Kapricoza bez pecuraka, extra kulen)
    """
    pass
class Statistic_Option:  # (manager)
    """ 
    Place to add any kind of statistic:
    Shift, Daily, Weekly, Montly sales etc...
    History chart: cene pojedinacne robe, proizvodna cena recepta, proizvodna cena promocije, Profit (prodajna cena - proizvodna cena)
    Prodaja: Po danima nedelje, Po Prodavcu, 
    """
    pass
class Group_Option:   # (manager)
    pass
class Actions_Options:   # (manager)
    pass

###### GLAVNI PROCES ######
class Main_Process:
    session_list   = {}

#    groups_list      = CP_menu.populate_groups()
#    recipe_list      = CP_menu.populate_recipes()
#    promotion_list   = CP_menu.populate_promotions()
#    ingredients_list = CP_menu.populate_ingredients()

    @classmethod
    def logout_main(cls, username):
        # remove from session_list
        pass

    def get_meni_data(self):  # Dobavlja sve Recepte i Promocije iz baze podataka (AUTO)
#        recipes = Database.get_data("Recepies")
#        promotion = Database.get_data("Promotion")
#        groups = Database.get_data("Groups")
#        for item in recipes:
#            self.recipe_list.append(item)
#        for item in promotion:
#            self.promotion_list.append(item)
#        for item in groups:
#            self.groups.append(item)
        pass

    def start():
        """
        Poredjati funkcije unutar beskonacne petlje
        """
        CP_menu.populate_active_items()
        pass
