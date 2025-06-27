from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Team
from schemas import TeamAssignment, TeamMemberOut
from core.auth import decode_token
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(prefix="/api/team", tags=["Team"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/assign")
def assign_employee(data: TeamAssignment, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can assign team members")
    
    employee = db.query(User).filter(User.id == data.employee_id, User.role == "employee").first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = db.query(Team).filter_by(manager_id=current_user.id, employee_id=employee.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee already assigned")

    new_relation = Team(manager_id=current_user.id, employee_id=employee.id)
    db.add(new_relation)
    db.commit()
    return {"message": "Employee assigned to team"}

@router.get("/unassigned")
def get_unassigned_employees(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can assign")

    # Get all employees
    all_employees = db.query(User).filter(User.role == "employee").all()

    # Get employee IDs already assigned to this manager
    assigned_ids = [t.employee_id for t in db.query(Team).filter_by(manager_id=current_user.id).all()]

    # Return employees not yet assigned
    unassigned = [emp for emp in all_employees if emp.id not in assigned_ids]
    return [{"id": emp.id, "username": emp.username} for emp in unassigned]


@router.get("/members", response_model=List[TeamMemberOut])
def get_team_members(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can view team")

    team = db.query(Team).filter(Team.manager_id == current_user.id).all()
    return [relation.employee for relation in team]
