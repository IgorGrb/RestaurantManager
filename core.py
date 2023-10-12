import json
import datetime as dt
from Database import DB_procedures


# Fokus mora biti da se prvo osposobe sve klase i funkcije do prodaje 
# Kada osposobimo da moze da se prodaje (da prodaja oduzima iz baze podataka) onda cemo da vidimo sta dalje
# Bitno je da imamo standardizovan INPUT i OUTPUT za svaku funkciju i metodu
# Svi podaci koji ulaze u fajl moraju biti str, int, float ili binary. (bez jpeg, jpg, mp3 itd...)


######## USER CLASSES #########
# Osmisliti kako da tip usera otkljucava ili zakljucava dostupne opcije

class Admin():
    def __init__(self, username):
        super().__init__(username)
        self.menu_options = [Connections_Option, Recipes_Option, Promotions_Option, User_Option, Invoice_Option, Statistic_Option, Group_Option, Actions_Options]
        """Can create Manager, Admin and Sales"""

class Manager():
    def __init__(self, username):
        super().__init__(username)
        self.menu_options = [Connections_Option, Recipes_Option, Promotions_Option, User_Option, Invoice_Option, Statistic_Option, Group_Option, Actions_Options]

        """Can create Manager and Sales"""

class Sales():
    """Cannot create Users"""
    def __init__(self, user:object):
        self.username:str = user.username
        self.access_list:list = user.accessList
        self.email:str = user.email
        self.cash:float = 0
        self.shift_open:int # If shift is open, enable sales
        self.shift_close:int
        self.sales_list:list   # list of IDs of sales [{"recept1": ""}]

    def open_shift(self):
        if self.shift_open == 0:
            self.shift_open = dt.datetime.utcnow().strftime("%d-%m-%Y %H:%M")
        else:
            return "Shift is open"

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

####### ERROR HANDLEING #######
class   Error_collector:    
    # svaka operacija koja moze da fail-uje treba da ima tip greske i podatak koji je izazvao gresku
    @staticmethod
    def collect_error(error):
        with open("ERROR LIST!!!.txt", "a")as txt:
            time = dt.datetime.utcnow().strftime("%d-%m-%Y %H:%M")
            txt.write(f"{error}-->{str(time)} + \n") # + time     Importovati Time module
            txt.close()

###### KORISNICKE OPCIJE ######
"""
Unutar sales.html ili manager.html
Metode bi trebale biti @classmethod-e jer ce se sama klasa ponasati kao skup funkcija jedne opcije
Sve promene i izmene bi trebale biti cuvane ili u JSON fajlu ili u klasi Main_Process()
"""
class Connections_Option: # (manager)
    # Povezivanje na internet 
    # Povezivanje na stampac, organizuje stampu po sekcijama (bar, kuhinja(sekcija za salate, sekcija za pice...))
    # Kreiranje i povezivanje na Cluster (ovo nekada u buducnosti)
    pass
class Recipes_Option:   # (manager)
    # Dali da bude objekat ili unos u JSON??? (prednosti vs mane)
    # Kreiranje novog recepta (ime, spisak robe koja se koristi sa kolicinom, cena, kojoj sekciji pripada (kuhinja, bar itd..), cena troskova izrade, profit)   
    # Brisanje recepta
    # Izmena recepta
    # Aktiviranje recepta (dodavanje u Grupu ili meni), neaktivni postoje ali nisu u meniju
    @classmethod
    def create_recipe(cls, recipe_data):
        recipe_name = recipe_data["recipe_name"]
        ingredients = recipe_data["ingredients"]
        price = recipe_data["price"]
        section = recipe_data["section"]
        production_cost = recipe_data["production_cost"]
        profit = recipe_data["profit"]

        # spremanje podataka
        recipe_insert_data = [
                {"recipe_name": recipe_name},
                {"recipe_ingredients": ingredients},
                {"recipe_price": price},
                {"recipe_section": section},
                {"recipe_production_cost": production_cost},
                {"recipe_profit": profit}]
        # Ubacivanje date u database putem insert_data() funkcije.

    @classmethod
    def delete_recipe(cls, recipe_name):
        condition = [{"recipe_name": recipe_name}]

    @classmethod
    def update_recipe(cls, recipe_name, new_data):
        # Azurirati informacije putem Database.update_data() Funkcije
        # "Nova data" mora biti u obliku recnika koji je u listi.
        pass

    @classmethod
    def activate_recipe(cls, recipe_name):
        # Provera da li je vec akrivan recept
        if cls.is_recipe_active(recipe_name):
            #ERROR VEC POSTOJI RECEPT U MENI-U
            return

class Promotions_Option:    # (manager)
    # Dali da bude objekat ili unos u JSON??? (prednosti vs mane)
    # Kreiranje nove promocije (ime, spisak robe ili recepta koja se koristi sa kolicinom, cena troskova izrade, profit)
    # Brisanje promocije
    # Izmena promocije
    # Aktiviranje recepta (dodavanje u Grupu ili meni), neaktivni postoje ali nisu u meniju
    @classmethod
    def create_promotion(cls, promotion_data):

        promotion_insert_data = [
            
                {"promotion_items": promotion_data["promotion_items"]},
                {"promotion_price": promotion_data["promotion_price"]},
                {"promotion_production_cost": promotion_data["promotion_production_cost"]},
                {"promotion_profit": promotion_data["promotion_profit"]}
            
        ]

    @classmethod
    def delete_promotion(cls, promotion_id):

        condition = [{"promotion_id": promotion_id}]

    @classmethod
    def update_promotion(cls, promotion_id, new_data):

        update_data = [
            
                {"promotion_items": new_data.get("promotion_items")},
                {"promotion_price": new_data.get("promotion_price")},
                {"promotion_production_cost": new_data.get("promotion_production_cost")},
                {"promotion_profit": new_data.get("promotion_profit")}
            
        ]

        condition = [{"promotion_id": promotion_id}]

class User_Option:  # (manager)
    # Add, Remove, Promote, Demote, User Statistics...
    pass
class Invoice_Option:   # (manager)
    # Dodaje robu u database Goods 
    # Add, Remove, Explore, Report Preview, Make Reports ...
    pass
class Statistic_Option:  # (manager)
    """ 
    Place to add any kind of statistic:
    Shift, Daily, Weekly, Montly sales etc...
    History chart: cene pojedinacne robe, proizvodna cena recepta, proizvodna cena promocije, Profit (prodajna cena - proizvodna cena)
    Prodaja: Po danima nedelje, Po Prodavcu, 
    """
    pass
class Sales_Option:  # (sales)
    """ 
    Dodavanje na racun, skidanje sa racuna, naplata racuna, storniranje naplate(manager)
    Personalizacija recepta pre prodaje (Kapricoza bez pecuraka, extra kulen)
    """
    pass
class Group_Option:   # (manager)
    # Kreiranje grupe (naziv, slika za button)
    # Brisanje grupe
    # Izmena grupe (dodavanje recepata, promocija)
    pass
class Actions_Options:   # (manager)
    # Napraviti logiku za kreiranje akcije. Treba da radi sa bazom podataka Kupci/Musterije.
    # Primer akcija: Na kupljenih 10 pica dobijes 1 gratis
    #                Za racun preko 1000rsd, sok 1,5l po izboru gratis 
    pass

###### GLAVNI PROCES ######
class Main_Process:
    """
    Kontrolise redosled aktiviranja procesa pri pokretanju programa:
        Povezivanje na baze podataka
        Kreiranje JSON fajla
        Pokretanje "index.html" u Browser-u
        Pokretanje servera za komunikaciju sa Frontend-om
    Kontrolise redosled gasenja procesa pri gasenju programa:
        UPDATE baze podataka iz JSON fajla
        Gasenje svih pomocnih skripti (server.py)
    Prati izmene na meniju i propagiranje izmena ulogovane sesije (ako menadzer izbrise nesto iz menija da se odmah vidi u sales.html)
    """
    session_list   = {}

    def __init__(self):
        self.groups         = []
        self.recipe_list    = []
        self.promotion_list = []

    @classmethod
    def login_database(cls, 
                       login_data=None, 
                       create_user_data=None, 
                       update_data=None, 
                       delete_user=None,
                       forgot_password=None,
                       logout=None):
        
        if login_data:
            # login_data = [username, password]
            response = DB_procedures.POST.login(login_data)
            status = response[0]
            user = response[1]

            if status == 200:
                name = user.username
                obj  = Sales(user=user)
                if user.position == "Sales":
                    cls.session_list.update({name: obj})
                    obj = {"Name": user.username,
                       "Position": user.position,
                       "AccessList": json.loads(user.accessList)}
                    response = json.dumps(obj)
                    return (200, response)
                
                elif user.position == "Admin":
                    cls.session_list.update({name: obj})  # Need finnishing
                    return (200, user)
                
                elif user.position == "Manager":
                    cls.session_list.update({name: obj}) # Need finnishing
                    return (200, user)
                
                else:
                    return (500, 'Internal server error')
            else:
                return (status, response[1])

        elif delete_user:
            pass

        elif forgot_password:
            pass

        else:
            Error_collector("Unsupported command: Main_process.login_database")

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

    def run():
        """
        Poredjati funkcije unutar beskonacne petlje
        """
        pass
