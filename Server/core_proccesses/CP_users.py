from database import DB_proc_users


class Users:    
    @classmethod
    def login(cls, data): # --> Main.login()
        login_data:list[str,str] = (data["username"], data["password"])        
        response = DB_proc_users.POST.login(login_data)
        return response

    @classmethod
    def create_user(cls, data):
        if data['password'] != data['rpt_password']:
            return (401, "Passwords dont match")
        if data.get('email'): email:str = data['email']
        else: email:  str               = ""

        new_user = (data['username'], 
                    data['password'], 
                    data['position'], 
                    email)

        response = DB_proc_users.POST.create_user(new_user)
        return response