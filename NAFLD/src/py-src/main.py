# python -m pip install -r ./setup.txt
from flask import Flask

app = Flask(__name__)


#  python -m flask --app .\webapptest.py
@app.route("/home")
def home():
    return "This is a test ENDPOINT"


# flask --app .\webapptest.py run


