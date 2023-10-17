from sqlalchemy import select, insert, delete, update
from sqlalchemy.orm import sessionmaker
import json
from .DB_models import *
from .DB_engines import engine


session_factory = sessionmaker(bind=engine)

class POST:
    @classmethod
    def login(cls, data: tuple[str, str]): # READY
        connection = session_factory()
        username, password = data
        try:
            statement = select(Login).where(Login.username == username)
            obj = connection.scalars(statement=statement).first()
            if not obj:
                return (402, "User don't exists")
            elif obj.password == password:
                return (200, obj)
            else:
                return (401, "Log in unsuccessfull")
        finally:
            connection.close()


    @classmethod
    def create_user(cls, data: tuple): # READY
        username, password, position, email = data
        session = session_factory()

        try:
            stmt = select(Login.username).select_from(Login).where(Login.username.in_([username]))
            result = session.scalars(stmt).first()
            if result == username:
               return (402, "Username allready exists")
        except:
            pass

        if position == "Admin":
            options = ["Admin", "Sales", "Shifts", "Recipes", "Statistic", "Invertory"]
            accessList = json.dumps(options)
        elif position == "Manager":
            options = ["Manager, Sales", "Shifts", "Recipes", "Statistic", "Invertory"]
            accessList = json.dumps(options)
        elif position == "Sales":
            options = ["Sales", "Shift", "Recipes", "Statistic", "Invertory"]
            accessList = json.dumps(options)     

        try:
            session.execute(
                insert(Login),
                {"username": username,
                 "password": password,
                 "position": position,
                 "accessList": accessList,
                 "email": email}
            )
            session.commit()
            return (200, "User successfully created")
        except:
            session.rollback()
            return (401, "User was not created")
        finally:
            session.close()

