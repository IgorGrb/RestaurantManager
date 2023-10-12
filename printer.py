from doctest import testfile
import tkinter as tk
from tkinter import ttk
import win32print
import win32ui
import win32con

def file_path():
    pass

def select_printer():
    global selected_printer
    selected_printer = printer_listbox.get(printer_listbox.curselection())
    print(f"Selected Printer: {selected_printer}")
    root.destroy() 

def printer_setupandprint():
    printer_handle = win32print.OpenPrinter(selected_printer)

    #printer context
    printer_info = win32print.GetPrinter(printer_handle, 2)
    printer_context = win32ui.CreateDC()
    printer_context.CreatePrinterDC(selected_printer)

    #printer properties
    printer_context.StartDoc('Print Document')
    printer_context.StartPage()
    printer_context.SetMapMode(win32con.MM_TWIPS)

    test_text = "test???"
    printer_context.TextOut(100, 100, test_text)

    printer_context.EndPage()
    printer_context.EndDoc()

    win32print.ClosePrinter(printer_handle)

printer_list=[]
printers=win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL, None, 1)

#basic GUI

root = tk.Tk()
root.title("Printer Selection")
label = tk.Label(root, text="Select a Printer:")
label.pack(pady=10)

printer_listbox = tk.Listbox(root, selectmode=tk.SINGLE)
for printer in printers:
    printer_listbox.insert(tk.END, printer[2])
printer_listbox.pack()

select_button = ttk.Button(root, text="Select Printer", command=select_printer)
select_button.pack(pady=10)

root.mainloop()

printer_setupandprint()


