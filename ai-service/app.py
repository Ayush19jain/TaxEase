from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="TaxEase AI Tax Assistant",
    description="ML-powered tax saving recommendations",
    version="1.0.0"
)

# CORS configuration to allow backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request and Response Models
class TaxAssistantRequest(BaseModel):
    """Input data for tax recommendation"""
    user_id: str
    age: int = Field(..., ge=18, le=100, description="User age")
    annual_income: float = Field(..., gt=0, description="Annual income in INR")
    current_deductions: float = Field(default=0, ge=0, description="Current deductions claimed")
    dependents: int = Field(default=0, ge=0, description="Number of dependents")
    has_home_loan: bool = Field(default=False)
    home_loan_principal: Optional[float] = Field(default=0, ge=0)
    home_loan_interest: Optional[float] = Field(default=0, ge=0)
    has_health_insurance: bool = Field(default=False)
    health_insurance_premium: Optional[float] = Field(default=0, ge=0)
    employment_type: str = Field(default="salaried", description="salaried, self-employed, business")
    investment_risk_appetite: str = Field(default="moderate", description="low, moderate, high")
    financial_year: str = Field(default="2024-25")

class TaxSavingRecommendation(BaseModel):
    """A single tax saving recommendation"""
    rank: int
    investment_type: str
    section: str
    recommended_amount: float
    potential_tax_saving: float
    rationale: str
    risk_level: str
    liquidity: str
    lock_in_period: Optional[str] = None

class TaxAssistantResponse(BaseModel):
    """AI-driven tax recommendations"""
    user_id: str
    total_tax_saving_potential: float
    recommendations: List[TaxSavingRecommendation]
    personalized_tips: List[str]
    model_version: str = "v1.0-rule-based"

# ML Model placeholder (to be replaced with actual trained model)
class TaxRecommenderModel:
    """Rule-based tax recommender (placeholder for ML model)"""
    
    def __init__(self):
        # Future: Load trained model weights here
        self.model_version = "v1.0-rule-based"
    
    def predict(self, request: TaxAssistantRequest) -> TaxAssistantResponse:
        """Generate personalized tax-saving recommendations"""
        recommendations = []
        tips = []
        rank = 1
        
        # Calculate current tax liability
        taxable_income = request.annual_income - request.current_deductions
        
        # Section 80C (up to ₹1.5 lakh)
        remaining_80c = max(0, 150000 - request.current_deductions)
        if remaining_80c > 0:
            # PPF recommendation
            ppf_amount = min(remaining_80c, 150000)
            tax_saved = self._calculate_tax_saving(request.annual_income, ppf_amount)
            recommendations.append(TaxSavingRecommendation(
                rank=rank,
                investment_type="Public Provident Fund (PPF)",
                section="80C",
                recommended_amount=ppf_amount,
                potential_tax_saving=tax_saved,
                rationale=f"PPF offers 7.1% interest (tax-free) with low risk. Ideal for {'young' if request.age < 40 else 'mature'} investors seeking long-term wealth.",
                risk_level="Low",
                liquidity="Low",
                lock_in_period="15 years"
            ))
            rank += 1
            
            # ELSS recommendation for moderate/high risk appetite
            if request.investment_risk_appetite in ["moderate", "high"] and remaining_80c > 50000:
                elss_amount = min(remaining_80c - ppf_amount, 50000)
                if elss_amount > 0:
                    tax_saved = self._calculate_tax_saving(request.annual_income, elss_amount)
                    recommendations.append(TaxSavingRecommendation(
                        rank=rank,
                        investment_type="Equity Linked Savings Scheme (ELSS)",
                        section="80C",
                        recommended_amount=elss_amount,
                        potential_tax_saving=tax_saved,
                        rationale="ELSS provides equity market exposure with shortest lock-in (3 years) among 80C options. High growth potential.",
                        risk_level="High" if request.investment_risk_appetite == "high" else "Moderate",
                        liquidity="Medium",
                        lock_in_period="3 years"
                    ))
                    rank += 1
        
        # Section 80D - Health Insurance
        if request.has_health_insurance and request.health_insurance_premium and request.health_insurance_premium < 25000:
            max_80d = 25000 if request.age < 60 else 50000
            additional_premium = max_80d - request.health_insurance_premium
            if additional_premium > 0:
                tax_saved = self._calculate_tax_saving(request.annual_income, additional_premium)
                recommendations.append(TaxSavingRecommendation(
                    rank=rank,
                    investment_type="Health Insurance Premium (Self + Family)",
                    section="80D",
                    recommended_amount=additional_premium,
                    potential_tax_saving=tax_saved,
                    rationale=f"Increase coverage to ₹{max_80d:,.0f} for better health protection and tax savings.",
                    risk_level="Low",
                    liquidity="N/A",
                    lock_in_period="Annual renewal"
                ))
                rank += 1
        elif not request.has_health_insurance:
            max_80d = 25000 if request.age < 60 else 50000
            tax_saved = self._calculate_tax_saving(request.annual_income, max_80d)
            recommendations.append(TaxSavingRecommendation(
                rank=rank,
                investment_type="Health Insurance Premium",
                section="80D",
                recommended_amount=max_80d,
                potential_tax_saving=tax_saved,
                rationale="Essential protection + tax benefit. Covers medical emergencies for you and family.",
                risk_level="Low",
                liquidity="N/A",
                lock_in_period="Annual renewal"
            ))
            rank += 1
        
        # Section 80CCD(1B) - NPS
        if request.age < 55:
            nps_amount = 50000
            tax_saved = self._calculate_tax_saving(request.annual_income, nps_amount)
            recommendations.append(TaxSavingRecommendation(
                rank=rank,
                investment_type="National Pension System (NPS)",
                section="80CCD(1B)",
                recommended_amount=nps_amount,
                potential_tax_saving=tax_saved,
                rationale="Additional ₹50k deduction over 80C. Builds retirement corpus with market-linked returns.",
                risk_level="Moderate",
                liquidity="Low",
                lock_in_period="Until age 60"
            ))
            rank += 1
        
        # Section 24 - Home Loan Interest
        if request.has_home_loan and request.home_loan_interest:
            max_interest_deduction = 200000
            if request.home_loan_interest < max_interest_deduction:
                tips.append(f"You can claim up to ₹{max_interest_deduction:,.0f} home loan interest under Section 24.")
        
        # Personalized tips
        if request.annual_income > 1500000:
            tips.append("Consider tax-saving FDs under 80C for lower-risk guaranteed returns.")
        
        if request.dependents > 0:
            tips.append("Consider child education insurance/savings plans for dual benefit of education corpus and tax savings.")
        
        if request.employment_type == "self-employed":
            tips.append("Claim business expenses, professional tax, and consider Section 44AD for presumptive taxation if applicable.")
        
        tips.append("Spread investments throughout the year to benefit from rupee cost averaging and avoid last-minute rush.")
        
        # Calculate total potential savings
        total_potential = sum(rec.potential_tax_saving for rec in recommendations)
        
        return TaxAssistantResponse(
            user_id=request.user_id,
            total_tax_saving_potential=round(total_potential, 2),
            recommendations=recommendations,
            personalized_tips=tips,
            model_version=self.model_version
        )
    
    def _calculate_tax_saving(self, annual_income: float, investment: float) -> float:
        """Calculate tax savings based on income slab"""
        # Simplified tax calculation (assumes new regime)
        if annual_income <= 300000:
            return 0
        elif annual_income <= 600000:
            return investment * 0.05
        elif annual_income <= 900000:
            return investment * 0.10
        elif annual_income <= 1200000:
            return investment * 0.15
        elif annual_income <= 1500000:
            return investment * 0.20
        else:
            return investment * 0.30

# Initialize model
model = TaxRecommenderModel()

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "service": "TaxEase AI Tax Assistant",
        "status": "running",
        "version": model.model_version
    }

@app.post("/api/ai/tax-recommendations", response_model=TaxAssistantResponse)
def get_tax_recommendations(request: TaxAssistantRequest):
    """
    Get personalized AI-driven tax-saving recommendations
    
    This endpoint analyzes user financial profile and provides
    ranked, personalized investment recommendations to minimize tax liability.
    """
    try:
        response = model.predict(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.get("/health")
def health_check():
    """Health check for monitoring"""
    return {"status": "healthy", "model_loaded": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
