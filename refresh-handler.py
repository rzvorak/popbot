from flask import Flask, request
import threading
import subprocess

app = Flask(__name__)
from flask_cors import CORS
CORS(app)  

@app.route('/start', methods=['POST'])
def start_script():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    refreshCount = data.get('refreshCountString')
    refreshSpeed = data.get('refreshSpeedString')
    subprocess.Popen(['python', '../refresh.py', username, password, refreshCount, refreshSpeed])
    return {"status": "Script started"}

if __name__ == '__main__':
    app.run(debug=True)