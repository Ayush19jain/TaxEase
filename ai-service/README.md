# TaxEase AI Tax Assistant Service

FastAPI-based microservice providing ML-powered tax-saving recommendations.

## Features

- 🤖 **AI-Driven Recommendations**: Personalized tax-saving suggestions based on user profile
- 📊 **Smart Analysis**: Considers income, age, risk appetite, and existing investments
- 🎯 **Ranked Suggestions**: Prioritized recommendations with potential tax savings
- 💡 **Actionable Tips**: Practical advice tailored to user situation

## Setup

### Prerequisites

- Python 3.9+
- pip

### Installation

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Service

```bash
# Development mode with auto-reload
uvicorn app:app --reload --port 8000

# Production mode
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

The service will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### POST `/api/ai/tax-recommendations`

Get personalized tax-saving recommendations.

**Request Body:**
```json
{
  "user_id": "user123",
  "age": 32,
  "annual_income": 1200000,
  "current_deductions": 50000,
  "dependents": 1,
  "has_home_loan": true,
  "home_loan_interest": 180000,
  "has_health_insurance": true,
  "health_insurance_premium": 15000,
  "employment_type": "salaried",
  "investment_risk_appetite": "moderate",
  "financial_year": "2024-25"
}
```

**Response:**
```json
{
  "user_id": "user123",
  "total_tax_saving_potential": 75000,
  "recommendations": [
    {
      "rank": 1,
      "investment_type": "Public Provident Fund (PPF)",
      "section": "80C",
      "recommended_amount": 100000,
      "potential_tax_saving": 15000,
      "rationale": "PPF offers 7.1% interest (tax-free) with low risk...",
      "risk_level": "Low",
      "liquidity": "Low",
      "lock_in_period": "15 years"
    }
  ],
  "personalized_tips": [
    "Spread investments throughout the year..."
  ],
  "model_version": "v1.0-rule-based"
}
```

## Integration with TaxEase Backend

The Node.js backend should call this service via HTTP:

```javascript
const axios = require('axios');

const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function getAIRecommendations(userData) {
  const response = await axios.post(
    `${aiServiceUrl}/api/ai/tax-recommendations`,
    userData
  );
  return response.data;
}
```

## Future ML Enhancements

Current implementation uses rule-based logic. To integrate ML models:

1. **Data Collection**: Gather historical user data (income, investments, outcomes)
2. **Feature Engineering**: Extract relevant features (age groups, income brackets, etc.)
3. **Model Training**: Train models (XGBoost, LightGBM) on collected data
4. **Model Deployment**: Replace `TaxRecommenderModel.predict()` with trained model inference
5. **Monitoring**: Track recommendation acceptance rates and optimize

### Model Training Pipeline (TODO)

```python
# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load training data
data = pd.read_csv('tax_training_data.csv')

# Feature engineering
features = ['age', 'income_bracket', 'risk_appetite', 'dependents']
X = data[features]
y = data['recommended_investment_type']

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# Save model
joblib.dump(model, 'models/tax_recommender.pkl')
```

## Environment Variables

Create `.env` file:

```env
# Service configuration
PORT=8000
WORKERS=4

# Model configuration
MODEL_PATH=models/tax_recommender.pkl
MODEL_VERSION=v1.0
```

## Testing

```bash
# Run tests (TODO: add test suite)
pytest tests/

# Test endpoint manually
curl -X POST http://localhost:8000/api/ai/tax-recommendations \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","age":30,"annual_income":800000}'
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment

- **AWS**: Deploy on Lambda with API Gateway or ECS
- **GCP**: Cloud Run or App Engine
- **Azure**: App Service or Container Instances

## License

Part of TaxEase platform.
