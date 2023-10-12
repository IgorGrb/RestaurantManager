from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from .DB_engines import engine
from typing import Optional



class Base(DeclarativeBase):
    pass


class Login(Base):
    __tablename__ = "Login"
    username:   Mapped[str] = mapped_column(primary_key=True, nullable=False)
    password:   Mapped[str] 
    position:   Mapped[str]
    accessList: Mapped[str]
    email:      Mapped[str] = mapped_column(nullable=True)

    def __repr__(self) -> str:
        return f"\n<User> \nUsername: {self.username}\nPosition: {self.position}\n"

class Companies(Base):
    __tablename__ = "Companies"
    ID:          Mapped[str]   = mapped_column(primary_key=True, nullable=False)
    name:        Mapped[str]   = mapped_column(primary_key=True, nullable=False)
    logo:        Mapped[Optional[bytes]]
    icon:        Mapped[Optional[bytes]] 
    address:     Mapped[Optional[str]]   
    phoneNumber: Mapped[Optional[str]]   
    website:     Mapped[Optional[str]]   
    contactList: Mapped[Optional[str]]   
    comment:     Mapped[Optional[str]]   

    def __repr__(self) -> str:
        return f"\n<Company>\nID: {self.ID}\nname: {self.name}"

class Invoices(Base):
    __tablename__ = "Invoices"
    invoiceID:   Mapped[str]   = mapped_column(primary_key=True, nullable=False)
    companyID:   Mapped[str]   = mapped_column(primary_key=True, nullable=False)
    companyName: Mapped[Optional[str]]   
    date:        Mapped[Optional[str]]   
    invoiceScan: Mapped[Optional[bytes]] 
    value:       Mapped[str] 
    valueNoTax:  Mapped[str] 
    tax:         Mapped[str] 
    dsctValue:   Mapped[Optional[str]] 
    dsctPercent: Mapped[Optional[str]] 

    def __repr__(self) -> str:
        first_part = f"\n<Invoice>\ninvoiceID: {self.invoiceID}\ncompanyID: {self.companyID}\ncompanyName: {self.companyName}\n"
        second_part = f"invoiceScan: {bool(self.invoiceScan)}\nvalue: {self.value}\nvalueNoTax: {self.valueNoTax}\n"
        third_part = f"tax: {self.tax}\ndsctValue: {self.dsctValue}\ndsctPercent: {self.dsctPercent}\n"
        return first_part + second_part + third_part


class Items(Base):
    __tablename__ = "Items"
    ID:           Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    invoiceID:    Mapped[str] = mapped_column(ForeignKey("Invoices.invoiceID"))
    amount:       Mapped[Optional[str]] 
    quantity:     Mapped[Optional[str]] 
    unit:         Mapped[Optional[str]] 
    name:         Mapped[Optional[str]] 
    brand:        Mapped[str]
    expDate:      Mapped[str]
    price:        Mapped[Optional[str]]
    priceNoTax:   Mapped[Optional[str]]
    tax:          Mapped[Optional[str]]
    dsctValue:    Mapped[str]
    dsctPercent:  Mapped[str]
    pricePerUnit: Mapped[Optional[str]]

    def __repr__(self) -> str:
        first_part = f"\n<Item>\nID: {self.ID}\ninvoiceID: {self.invoiceID}\namount: {self.amount}\nquantity: {self.quantity}\nname: {self.name}"
        second_part = f"\nbrand: {self.brand}\nexpDate: {self.expDate}\nprice: {self.price}\npriceNoTax: {self.priceNoTax}\ntax: {self.tax}"
        third_part = f"\ndsctValue: {self.dsctValue}\ndsctPercent: {self.dsctPercent}\npricePerUnit: {self.pricePerUnit}\n"
        return first_part + second_part + third_part


Base.metadata.create_all(bind=engine)