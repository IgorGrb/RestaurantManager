import json
from database import DB_proc_invoices



class Invoices:
    @classmethod
    def get_companies_list(cls):
        companies_list = DB_proc_invoices.GET.get_companies_list()

        if not companies_list:
            return (201, 'List is empty')

        response = []
        for data in companies_list:
            decoded_icon:str = data[0].decode('utf-8')
            response.append({"icon": decoded_icon, "name": data[1], "ID": data[2]})
        
        data = json.dumps({"data": response})

        if response:
            return (200, data)
        else:
            return (500, "Internal server error")

    @classmethod    
    def get_invoices_list(cls):
        invoices_list = DB_proc_invoices.GET.get_invoices_list()

        if len(invoices_list) < 1:
            return (201, "List is empty")

        response = []
        for data in invoices_list:
            decoded_icon:str = data[3].decode('utf-8')
            response.append({"ID": data[0], "name": data[1], "date": data[2] , "icon": decoded_icon, "companyID": data[4]})

        data = json.dumps({"data": response})

        if len(response) >= 1:
            return (200, data)
        else:
            return (500, "Internal server error")

    @classmethod
    def save_company_data(cls, data):
        logo = bytes(data['logo'], 'utf-8')
        icon = bytes(data['icon'], 'utf-8')

        insert_data = (data['companyID'], 
                        data['companyName'], 
                        logo, 
                        icon, 
                        data['address'], 
                        data['phoneNumber'], 
                        data['website'], 
                        json.dumps(data['contactList']), 
                        data['comment'])
        response = DB_proc_invoices.POST.save_company_data(insert_data)

        if response:
            return (response[0], response[1]) 
        #else:
        #    Error_collector.collect_error(f"Problem with saveing company data\nInput data: {[data]}")        

    @classmethod
    def load_company_data(cls, data):
        search:tuple = (data['ID'], data['name'])

        status, data = DB_proc_invoices.POST.load_company_data(data=search)
        obj = {"data": data}
        data = json.dumps(obj)
        if status != 200:
            return (500, "Internal server error")
        return (status, data)

    @classmethod
    def save_invoice_data(cls, data):
        try:
            response = DB_proc_invoices.POST.save_invoice_data(data)
            return (response[0], response[1])
        except:
            return (222, "Failed")

    @classmethod
    def load_invoice_data(cls, data):
        try:
            invoice, items = DB_proc_invoices.POST.load_invoice_data(data)

            parsed_items: list = []
            if items:
                for item in items:
                    parsed_items.append({"itemID": item.ID,
                                        "quantity": item.quantity, 
                                        "unit": item.unit, 
                                        "name": item.name, 
                                        "brand": item.brand, 
                                        "expDate": item.expDate, 
                                        "price": item.price, 
                                        "priceNoTax": item.priceNoTax, 
                                        "tax": item.tax, 
                                        "dsctValue": item.dsctValue, 
                                        "dsctPercent": item.dsctPercent, 
                                        "pricePerUnit": item.pricePerUnit})               

            if invoice:
                invoiceScan = invoice.invoiceScan.decode('utf-8')
                parsed_invoice = {"invoiceID": invoice.invoiceID, 
                        "date": invoice.date, 
                        "invoiceScan": invoiceScan, 
                        "value": invoice.value, 
                        "valueNoTax": invoice.valueNoTax, 
                        "tax": invoice.tax, 
                        "dsctValue": invoice.dsctValue, 
                        "dsctPercent": invoice.dsctPercent}

            obj = {"Invoice": parsed_invoice, "Data": parsed_items}
            data = json.dumps(obj)
            return (200, data)

        except:
            return (500, "Internal server error")
               
    @classmethod
    def update_company_data(cls, data):
        contactList = json.dumps(data['contactList'])
        logo = bytes(data['logo'], 'utf-8')
        icon = bytes(data['icon'], 'utf-8')

        insert_data = [data['companyID'],
                        data['companyName'], 
                        logo, 
                        icon,
                        data['address'], 
                        data['phoneNumber'], 
                        data['website'], 
                        contactList, 
                        data['comment']]

        status, response = DB_proc_invoices.PUT.update_company_data(insert_data)
        if response:
            return (status, response) 
        #else:
        #    Error_collector.collect_error(f"Problem with saveing company data\nInput data: {data}")

    @classmethod
    def update_company_comment(cls, data):
        try:
            response = DB_proc_invoices.PUT.update_company_comment(data)
            print("Response", response)
            if response:
                return (response[0], response[1]) 
            #else:
            #    Error_collector.collect_error(f"Problem with saveing company data\nInput data: {data}")

        except: # Need to adjust error
            return (500, "Internal server error")         

    @classmethod
    def update_invoice_data(cls, data):
        try:
            result = DB_proc_invoices.PUT.update_invoice_data(data)

            if result[0] == 200:
                return (200, "All data successfully updated")
        except:
            return (500, "Internal server error")

    @classmethod
    def delete_company(cls, data):
        try:
            id = data['ID'][0]
            name = data['name'][0]
            status, response = DB_proc_invoices.DELETE.delete_company((id, name))
            return (status, response)

        except:
            return (400, "Something went wrong")         

    @classmethod
    def delete_invoice(cls, data):
        try:
            id = data['ID'][0]
            compID = data['CID'][0]
            status, response = DB_proc_invoices.DELETE.delete_invoice((id, compID))
            return (status, response)
        except:
            return (500, "Internal error")        

