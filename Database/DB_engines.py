from sqlalchemy import create_engine
import os

path = os.path.join(os.path.dirname(__file__),'UNPS.db')
engine = create_engine(f"sqlite:///{path}")

    