# PythonAnywhere WSGI fayli namunasi.
# Dashboard → Web → WSGI configuration file ichiga nusxa qiling.
# USERNAME ni o'z loginingiz bilan almashtiring.

import sys

path = '/home/USERNAME/it-navigator'
if path not in sys.path:
    sys.path.insert(0, path)

from config.wsgi import application
