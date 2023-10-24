from core import *
from types_list import *
from database import DB_proc_invoices
import threading as tr
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
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
                    status, response = InvoiceProcessorRouter.get_company_list()
                    self.send_response_to_client(status, response)

                except:
                    self.send_response_to_client(500, "Internal server error")
                    Error_collector.collect_error(f"Getting List of Companies failed \nInput data: {command}")

            elif command == "getInvoicesList":
                try:
                    status, response = InvoiceProcessorRouter.get_invoice_list()
                    self.send_response_to_client(status, response)

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
            if   command == 'login': # READY
                status, response = UserProcessorRouter.login(data)
                self.send_response_to_client(status, response)

            elif command == 'createUser': # READY
                status, response = UserProcessorRouter.create_user(data)
                self.send_response_to_client(status, response)
                                
            elif command == 'saveCompanyData': # READY                
                status, response = InvoiceProcessorRouter.save_company_data(data)
                self.send_response_to_client(status, response)  
            
            elif command == 'loadCompanyData': # READY
                status, response = InvoiceProcessorRouter.load_company_data(data)
                self.send_response_to_client(status, response)    
               
            elif command == 'saveInvoiceData': # READY
                status, response = InvoiceProcessorRouter.save_invoice_data(data)
                self.send_response_to_client(status, response)
               
            elif command == 'loadInvoiceData': # READY
                status, response = InvoiceProcessorRouter.load_invoice_data(data)
                self.send_response_to_client(status, response)

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
            if command   == 'updateCompanyData':
                status, response = InvoiceProcessorRouter.update_company_data(data)
                self.send_response_to_client(status, response) 

            elif command == "updateInvoiceData":  # NEED TO MAKE IT AS A SINGLE TRANSACTION
                status, response = InvoiceProcessorRouter.update_invoice_data(data)
                self.send_response_to_client(status, response)

            elif command == "updateCompanyComment":
                status, response = InvoiceProcessorRouter.update_company_comment(data)
                self.send_response_to_client(status, response)

        except KeyError:
            self.send_response_to_client(404, "Incorect parameters provided")

    def do_DELETE(self):
        self.log_message("Incoming DELETE request...") 
        data = parse_qs(self.path[2:])
        command:str = data['command'][0]

        try:
            if command == "deleteCompany":
                status, response = InvoiceProcessorRouter.delete_company(data)
                self.send_response_to_client(status, response)

            if command == "deleteInvoice":
                status, response = InvoiceProcessorRouter.delete_invoice(data)
                self.send_response_to_client(status, response)

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