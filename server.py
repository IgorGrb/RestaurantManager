from core import *
from types_list import *
from Database import DB_procedures
import threading as tr
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import sqlite3
import subprocess
import os
import sys
import getpass


class RequestHandler(BaseHTTPRequestHandler):

    """
    html_path = os.path.join(os.path.dirname(__file__), "htmls", "index.html")
    command = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", html_path]
    subprocess.run(command)
    """
    def do_OPTIONS(self):
        # Set CORS headers to allow cross-origin requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, GET, DELETE')  # Specify the allowed HTTP methods
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.log_message("Incoming GET request...")
        command = self.path[2:]
        try:          
            if command == 'getCompaniesList': # READY
                try:
                    comp_list = DB_procedures.GET.get_companies_list()

                    if not comp_list:
                        self.send_response_to_client(201, 'List is empty')

                    response = []
                    for data in comp_list:
                        decoded_icon:str = data[0].decode('utf-8')
                        response.append({"icon": decoded_icon, "name": data[1], "ID": data[2]})
                    data = json.dumps({"data": response})

                    if response:
                        self.send_response_to_client(200, data)
                    else:
                        self.send_response_to_client(500, "Internal server error")
                        Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

            elif command == "getInvoicesList":
                try:
                    inv_list = DB_procedures.GET.get_invoices_list()

                    if len(inv_list) < 1:
                        self.send_response_to_client(201, "List is empty")

                    response = []
                    for data in inv_list:
                        decoded_icon:str = data[3].decode('utf-8')
                        response.append({"ID": data[0], "name": data[1], "date": data[2] , "icon": decoded_icon, "companyID": data[4]})

                    data = json.dumps({"data": response})

                    if len(response) >= 1:
                        self.send_response_to_client(200, data)
                    else:
                        self.send_response_to_client(500, "Internal server error")
                        Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

        except:
            self.send_response_to_client(404, "Incorrect parameters provided")
            self.log_message("Incorect parameters provided")

    def do_POST(self):
        self.log_message("Incoming POST request...")
        content_length:int = int(self.headers['Content-Length'])
        post_data:str       = self.rfile.read(content_length)
        data:dict          = json.loads(post_data)
        try:
            data = json.loads(data) # create user makes problem
        except:
            command:str        = data.pop("command")
            print(command)

        try:
            if command == 'login': # READY
                login_data:list[str,str] = (data["username"], data["password"])
                response:object = Main_Process.login_database(login_data=login_data)
                status:int = response[0]
                user:object = response[1]
                
                if response:
                    self.send_response_to_client(status, user)
                else:
                    Error_collector.collect_error(f"Problem with login. \nInput data: {data}")

            elif command == 'createUser': # READY
                if data.get('email'):
                    email:str = data['email']
                else:
                    email:str = ""
                position:str     = data['position']
                username:str     = data['username']
                password:str     = data['password']
                rpt_password:str = data['rpt_password']

                new_user = (username, password, position, email)

                if password == rpt_password:
                    response = DB_procedures.POST.create_user(new_user)
                else:
                    return (401, "Passwords dont match")
                              
                if response:
                    self.send_response_to_client(response[0], response[1])
                else:
                    Error_collector.collect_error(f"Problem with creating user.\nInput data: {data}")
            
            elif command == 'saveCompanyData': # READY
                try:
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
                    response = DB_procedures.POST.save_company_data(insert_data)

                    if response:
                        self.send_response_to_client(response[0], response[1]) 
                    else:
                        Error_collector.collect_error(f"Problem with saveing company data\nInput data: {[data]}")
                
                except sqlite3.IntegrityError as e:
                    self.send_response_to_client(400, "Company already exists")   
            
            elif command == 'loadCompanyData': # READY
                try:
                    search:tuple = (data['ID'], data['name'])

                    status, data = DB_procedures.POST.load_company_data(data=search)
                    obj = {"data": data}
                    data = json.dumps(obj)
                    if status == 200:
                        self.send_response_to_client(status, data)
                    else:
                        self.send_response_to_client(500, "Internal server error")
                        Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

            elif command == 'saveInvoiceData': # READY
                try:
                    try:
                        response = DB_procedures.POST.save_invoice_data(data)
                        self.send_response_to_client(response[0], response[1])

                    except:
                        self.send_response_to_client(222, "Failed")

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")
                
            elif command == 'loadInvoiceData': # READY
                try:
                    invoice, items = DB_procedures.POST.load_invoice_data(data)

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
                    self.send_response_to_client(200, data)

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")
            

            elif data["command"][0] == 'postShift':
                pass
            
            elif data["command"][0] == 'postSales':
                pass

            elif data["command"][0] == 'postInvoices':
                pass

        except KeyError:
            self.send_response_to_client(404, "Incorect parameters provided")

    def do_PUT(self):
        self.log_message("Incoming PUT request...")
        command = self.path[2:]  # saveCompanyData
        content_length = int(self.headers['Content-Length'])
        put_data = self.rfile.read(content_length)
        data = json.loads(put_data) # {"Name":"ICB","ID":"123654","Logo":[{}],"Icon":[{}],"Address":"","PhoneNumber":"","Website":"www.icb.cl","ContactList":[]}'
        command = data.pop('command')
        try:
            if command == 'updateCompanyData':
                try:
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

                    response = DB_procedures.PUT.update_company_data(insert_data)
                    if response:
                        self.send_response_to_client(response[0], response[1]) 
                    else:
                        Error_collector.collect_error(f"Problem with saveing company data\nInput data: {data}")
                
                except sqlite3.IntegrityError as e: # Need to adjust error
                    self.send_response_to_client(500, "Internal server error")   

            elif command == "updateInvoiceData":  # NEED TO MAKE IT AS A SINGLE TRANSACTION
                try:
                    result = DB_procedures.PUT.update_invoice_data(data)

                    if result[0] == 200:
                        self.send_response_to_client(200, "All data successfully updated")
                    else:
                        self.send_response_to_client(400, "There was a problem with saveing data")


                except sqlite3.IntegrityError as e: # Need to adjust error
                    self.send_response_to_client(500, "Internal server error")

            elif command == "updateCompanyComment":
                try:
                    response = DB_procedures.PUT.update_company_comment(data)
                    print("Response", response)
                    if response:
                        self.send_response_to_client(response[0], response[1]) 
                    else:
                        Error_collector.collect_error(f"Problem with saveing company data\nInput data: {data}")

                except sqlite3.IntegrityError as e: # Need to adjust error
                    self.send_response_to_client(500, "Internal server error") 

        except KeyError:
            self.send_response_to_client(404, "Incorect parameters provided")

    def do_DELETE(self):
        self.log_message("Incoming DELETE request...") 
        data = parse_qs(self.path[2:])
        command:str = data['command'][0]

        try:
            if command == "deleteCompany":
                print(data)
                try:
                    id = data['ID'][0]
                    name = data['name'][0]
                    status, response = DB_procedures.DELETE.delete_company((id, name))
                    self.send_response_to_client(status, response)

                except:
                    self.send_response_to_client(400, "Something went wrong") 


            if command == "deleteInvoice":
                try:
                    id = data['ID'][0]
                    compID = data['CID'][0]
                    status, response = DB_procedures.DELETE.delete_invoice((id, compID))
                    self.send_response_to_client(status, response)

                except:
                    self.send_response_to_client(500, "Internal error")

        except KeyError:
            self.send_response_to_client(404, "Incorect parameters provided")



    def send_response_to_client(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-type", "application/json, text/plain")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(str(data).encode())


class Start_Server:   # MOZDA MOZE DA SE BRISE
    def __init__(self):
        self.server = None
    def run_server(self):
            self.server = subprocess.Popen(["python", "server.py"]) 
    def is_server_running(self):
        if self.server.poll() is None:
            return True
        return False
    def stop_server(self):
        if self.is_server_running():
            self.server.terminate()
            self.server.wait()


def open_Browser():

    if sys.platform.startswith('linux'):
        return
        os.environ['BROWSER'] = "/usr/bin/microsoft-edge"
        os.environ['PATH'] += ":/usr/bin/npm"  

        script_path = os.path.abspath(__file__)
        print(script_path)
        script_directory = os.path.dirname(script_path)
        print(script_directory)
        path_components = script_directory.split(os.path.sep)
        print(path_components)
        root_directory = os.path.sep.join(path_components[:3])
        print(root_directory)
        desired_directory = "restaurant-manager"
        project_path = os.path.join(script_directory, desired_directory) #root_directory
        print(project_path)
        os.chdir(project_path)

        command = "npm start"

# Get the user's password securely
        password = getpass.getpass("Enter your password: ")

        try:
            # Use the 'echo' command to pass the password to 'sudo'
            cmd = f'echo "{password}" | sudo -S {command}'
            subprocess.run(cmd, shell=True, check=True, text=True)

        except subprocess.CalledProcessError as e:
            print(f"Command failed with exit code {e.returncode}")
            print("Error message:")
            print(e.stderr)

    elif sys.platform.startswith('win'):
        os.environ['BROWSER'] = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

        react_path = os.path.join(os.path.dirname(__file__),'restoran-manager')
        os.chdir(react_path)

        cmd_command = 'npm start'
        subprocess.run(cmd_command, shell=True, check=True)

    elif sys.platform.startswith('darwin'):
        print("Running on macOS")

if __name__ == "__main__":
    server_address = ("127.0.0.1", 8080)
    http_server = HTTPServer(server_address, RequestHandler)
    server_thread = tr.Thread(target=http_server.serve_forever)
    print("HTTP Server started!")
    server_thread.start()
    main = Main_Process()
    print("Main process started!")
    open_Browser()