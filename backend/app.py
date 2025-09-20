from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def calculate_risk_score(budget, deadline, resources):
    risk = 0
    if budget < 5000: risk += 30
    elif budget < 20000: risk += 15
    if deadline < 10: risk += 30
    elif deadline < 30: risk += 15
    if resources < 3: risk += 30
    elif resources < 6: risk += 15
    return min(risk, 100)

def predict_bottlenecks(budget, deadline, resources):
    bottlenecks = []
    if budget < 5000: bottlenecks.append("Insufficient budget")
    if deadline < 10: bottlenecks.append("Tight deadlines")
    if resources < 3: bottlenecks.append("Limited resources")
    return bottlenecks

@app.route('/assess-risk', methods=['POST'])
def assess_risk():
    data = request.json
    budget = data.get('budget', 0)
    deadline = data.get('deadline', 0)  # number of days remaining
    resources = data.get('resources', 0)
    return jsonify({
        'risk_score': calculate_risk_score(budget, deadline, resources),
        'bottlenecks': predict_bottlenecks(budget, deadline, resources)
    })

@app.route('/')
def home():
    return "Dynamic Risk Assessment Tool backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
