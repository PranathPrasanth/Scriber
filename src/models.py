from typing import Optional
from pydantic import BaseModel


class ExpenseData(BaseModel):
    vendor: Optional[str] = None
    bill_number: Optional[str] = None
    date: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = "INR"
    gst_rate: Optional[str] = None
    gst_amount: Optional[float] = None