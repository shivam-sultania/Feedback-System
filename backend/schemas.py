from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class FeedbackCreate(BaseModel):
    employee_id: int
    strengths: str
    areas_to_improve: str
    sentiment: str

class FeedbackOut(BaseModel):
    id: int
    strengths: str
    areas_to_improve: str
    sentiment: str
    acknowledged: bool
    created_at: datetime
    updated_at: datetime
    manager_id: int
    employee_id: int
    manager_name: Optional[str] = None

    class Config:
        orm_mode = True
        
class TeamAssignment(BaseModel):
    employee_id: int

class TeamMemberOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True
