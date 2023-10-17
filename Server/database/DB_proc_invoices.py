from sqlalchemy import select, insert, delete, update
from sqlalchemy.orm import sessionmaker
import json
from .DB_models import *
from .DB_engines import engine



session_factory = sessionmaker(bind=engine)

class GET:
    @classmethod
    def get_companies_list(cls): # missing response: 201, List is empty
        select_columns = select(Companies.icon, Companies.name, Companies.ID)
        statement = select_columns.select_from(Companies)
        with engine.connect() as connection:
            response: list = connection.execute(statement=statement).fetchall()
            return response


    @classmethod # missing response: 201, List is empty
    def get_invoices_list(cls):
        select_columns = select(
            Invoices.invoiceID, 
            Invoices.companyName, 
            Invoices.date, 
            Invoices.invoiceScan,
            Invoices.companyID)
        statement = select_columns.select_from(Invoices)
        with engine.connect() as connection:
            response: list = connection.execute(statement=statement).fetchall()
            return response


class POST:        

    @classmethod
    def save_company_data(cls, data):
        session = session_factory()
        companyID, companyName, logo, icon, address, phoneNumber, website, contactList, comment = data
        
        # Checks if Company allready exists READY
        try:         
            table = select(Companies.ID, Companies.name).select_from(Companies)
            stmt = table.where(Companies.ID == companyID, Companies.name == companyName)
            result = session.execute(stmt).first()
            if result == (companyID, companyName):
                return (402, "Company allready exists")
        except:
            pass


        try:
            session.execute(
                insert(Companies), 
                {"ID": companyID,
                "name": companyName,
                "logo": logo,
                "icon": icon,
                "address": address,
                "phoneNumber": phoneNumber,
                "website": website,
                "contactList": contactList,
                "comment": comment}
                )
            session.commit()
            return (200, "Company successfully created")
        except:
            session.rollback()
            return (401, "Company was not created")
        finally:
            session.close()


    @classmethod
    def load_company_data(cls, data):
        session = session_factory()
        id, name = data
        try:
            stmt = select(Companies).where(Companies.ID == id, Companies.name == name)
            comp = session.scalars(stmt).first()

            logo = comp.logo.decode('utf-8')
            icon = comp.icon.decode('utf-8')
            contactList = json.loads(comp.contactList)

            response = {
                "ID": comp.ID,
                "name": comp.name,
                "logo": logo, 
                "icon": icon, 
                "address": comp.address, 
                "phoneNumber": comp.phoneNumber, 
                "website": comp.website, 
                "contactList": contactList, 
                "comment": comp.comment
                }
            return (200, response)
        finally:
            session.close()


    @classmethod
    def save_invoice_data(cls, data):
        session = session_factory()

        invoiceID = data.pop('invoiceID') 
        companyID = data.pop('companyID')  
        companyName = data.pop('companyName')  
        date = data.pop('date')  
        invoiceScan = data.pop('invoiceScan')  
        value = data.pop('value')  
        valueNoTax = data.pop('valueNoTax')  
        tax = data.pop('tax')  
        dsctValue = data.pop('dsctValue')  
        dsctPercent = data.pop('dsctPercent')

        itemsData = data.pop('itemsData')

        invoiceScan = bytes(invoiceScan, 'utf-8')

        list_of_items = []
            
        new_invoice = Invoices(
            invoiceID   = invoiceID,
            companyID   = companyID,
            companyName = companyName,
            date        = date,
            invoiceScan = invoiceScan,
            value       = value,
            valueNoTax  = valueNoTax,
            tax         = tax,
            dsctValue   = dsctValue,
            dsctPercent = dsctPercent
        )
        list_of_items.append(new_invoice)

        for item in itemsData:
            quantity = item.pop('quantity') 
            unit = item.pop('unit') 
            name = item.pop('name') 
            brand = item.pop('brand')
            expDate = item.pop('expDate')
            price = item.pop('price')
            priceNoTax = item.pop('priceNoTax')
            i_tax = item.pop('tax')
            i_dsctValue = item.pop('dsctValue')
            i_dsctPercent = item.pop('dsctPercent')
            pricePerUnit = item.pop('pricePerUnit')

            new_item = Items(
                invoiceID    = invoiceID,
                amount       = quantity,
                quantity     = quantity,
                unit         = unit,
                name         = name,
                brand        = brand,
                expDate      = expDate,
                price        = price,
                priceNoTax   = priceNoTax,
                tax          = i_tax,
                dsctValue    = i_dsctValue,
                dsctPercent  = i_dsctPercent,
                pricePerUnit = pricePerUnit
            )
            list_of_items.append(new_item)

        session.add_all(list_of_items)

        try:
            session.commit()
            return (200, "Invoice saved successfully")
        except Exception as e:
            session.rollback()
            return (401, "Failed to save invoice")
        finally:
            session.close()


    @classmethod
    def load_invoice_data(cls, data):
        session = session_factory()

        ID = data['ID']
        compID = data['compID']
        try:
            invoiceQ = select(Invoices).where(Invoices.invoiceID == ID, Invoices.companyID == compID)
            invoice = session.scalars(invoiceQ).first()

            itemsQ = select(Items).where(Items.invoiceID == ID)
            items = session.scalars(itemsQ).all()
            
            return (invoice, items)
        finally:
            session.close()



class PUT:
    @classmethod
    def update_company_data(cls, data):
        companyID, name, logo, icon, address, phoneNumber, website, contactList, comment = data
        session = session_factory()
        try:
            company = session.execute(select(Companies).filter(Companies.ID == companyID, Companies.name == name)).scalar_one()
            company.name = name
            company.logo = logo
            company.icon = icon
            company.address = address
            company.phoneNumber = phoneNumber
            company.website = website
            company.contactList = contactList
            company.comment = comment
            
            if company in session.dirty:
                session.commit()
                return (200, "Company successfully updated")
        except:
            session.rollback()
            return (401, "Company was not updated")
        finally:
            session.close()

    @classmethod
    def update_company_comment(cls, data):
        session = session_factory()
        compID  = data['companyID'] 
        name    = data['companyName'] 
        comment = data['comment']
        try:
            company = session.execute(
                select(Companies)
                .filter(Companies.ID == compID, Companies.name == name)).scalar_one()
            company.comment = comment
            session.commit()
            return (200, "Comment was updated successfully")
        except:
            session.rollback()
            return (401, "Comment failed to update")
        finally:
            session.close()

    @classmethod
    def update_invoice_data(cls, data):  # NESTO ZAJEBAVA NEGDE
        #print(type(data), data)
        session       = session_factory()

        invoiceID, companyID, companyName, date, invoiceScan, value, valueNoTax, tax, dsctValue, dsctPercent, itemsData = list(data.values())
        list_for_update = []
        invoice = session.execute(
            select(Invoices)
            .filter(Invoices.invoiceID == invoiceID, Invoices.companyID == companyID)     
        ).scalar_one()
        
        invoice.companyName = companyName
        invoice.date        = date
        invoice.invoiceScan = bytes(invoiceScan, 'utf-8')
        invoice.value       = value
        invoice.valueNoTax  = valueNoTax
        invoice.tax         = tax
        invoice.dsctValue   = dsctValue
        invoice.dsctPercent = dsctPercent

        itemsIDs = session.execute(select(Items.ID).where(Items.invoiceID == invoiceID)).all()
        list_of_IDs = [t[0] for t in itemsIDs] 
        for item in itemsData:
            itemID, quantity, unit, name, brand, expDate, price, priceNoTax, i_tax, i_dsctValue, i_dsctPercent, pricePerUnit = list(item.values())

            if itemID not in list_of_IDs or itemID == False: # Creating new items
                print("\nID NOT in List\n")
                print(f"<Items ID: {itemID}> <List of IDs: {list_of_IDs}")
                new_item = Items(
                    ID           = None,
                    invoiceID    = invoiceID,
                    amount       = quantity,
                    quantity     = quantity,
                    unit         = unit,
                    name         = name,
                    brand        = brand,
                    expDate      = expDate,
                    price        = price,
                    priceNoTax   = priceNoTax,
                    tax          = i_tax,
                    dsctValue    = i_dsctValue,
                    dsctPercent  = i_dsctPercent,
                    pricePerUnit = pricePerUnit
                )
                session.add_all([new_item])
                session.flush()

            if itemID in list_of_IDs: # Updating existing items
                print("\n ID in List\n")
                print(f"<Item ID: {itemID}> <List of IDs: {list_of_IDs}>")
                # Removing current ID from itemsIDs
                index = list_of_IDs.index(itemID)
                list_of_IDs.pop(index) 
                item_obj = ''
                session.execute(
                    update(Items)
                    .where(Items.ID == itemID)
                    .values(
                        ID           = itemID,
                        quantity     = quantity,
                        unit         = unit,
                        name         = name,
                        brand        = brand,
                        expDate      = expDate,
                        price        = price,
                        priceNoTax   = priceNoTax,
                        tax          = i_tax,
                        dsctValue    = dsctValue,
                        dsctPercent  = dsctPercent,
                        pricePerUnit = pricePerUnit
                    )
                )
        
        print(f"Leftower IDs: {list_of_IDs}")
        if len(list_of_IDs) >= 1:
            for id in list_of_IDs:
                print("\nDeleted items\n")
                session.execute(delete(Items).where(Items.ID == id))
                session.flush()

        try:
            session.commit()
            print("Commit successfull")
            return (200, "Invoice updated successfully")
        except:
            session.rollback()
            return (401, "Invoice failed to update")
        finally:
            session.close()



class DELETE:
    @classmethod
    def delete_company(cls, data):
        session = session_factory()
        id, name = data
        try:
            session.execute(
                delete(Companies)
                .where(Companies.ID == id, Companies.name == name))
            session.commit()
            return (200, "Company successfully deleted")
        except:
            session.rollback()
            return (401, "Company not deleted")
        finally:
            session.close()


    @classmethod
    def delete_invoice(cls, data):
        session = session_factory()
        id, compID = data
        try:
            session.execute(
                delete(Invoices)
                .where(Invoices.invoiceID == id, Invoices.companyID == compID)
            )
            session.execute(
                delete(Items)
                .where(Items.invoiceID == id)
            )
            session.commit()
            return (200, "Invoice deleted successfully")
        except:
            session.rollback()
            return (401, "Invoice was not deleted")
        finally:
            session.close()
