from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Feedback, User, Team
from schemas import FeedbackCreate, FeedbackOut
from core.auth import decode_token
from fastapi.security import OAuth2PasswordBearer
from typing import List,no_type_check
from sqlalchemy import desc

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@no_type_check
def is_manager_of(db: Session, manager_id: int, employee_id: int):
    return db.query(Team).filter_by(manager_id=manager_id, employee_id=employee_id).first() is not None

# --- DB Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Current User ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Create Feedback (Manager only) ---
@router.post("/", response_model=FeedbackOut)
def create_feedback(data: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can give feedback")

    feedback = Feedback(
        strengths=data.strengths,
        areas_to_improve=data.areas_to_improve,
        sentiment=data.sentiment,
        manager_id=current_user.id,
        employee_id=data.employee_id,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

# --- Get Feedbacks ---
@router.get("/employee/{employee_id}", response_model=List[FeedbackOut])
def get_feedbacks_for_employee(employee_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "manager" and not is_manager_of(db, current_user.id, employee_id):
        raise HTTPException(status_code=403, detail="Not your employee")
    elif current_user.role == "employee" and current_user.id != employee_id:
        raise HTTPException(status_code=403, detail="Access denied")

    feedbacks = db.query(Feedback).filter(Feedback.employee_id == employee_id).order_by(desc(Feedback.updated_at)).all()
    
    # Add manager_name for employee view
    for fb in feedbacks:
        if fb.manager:
            fb.manager_name = fb.manager.username

    return feedbacks

# --- Update Feedback (Manager only) ---
@router.put("/{feedback_id}", response_model=FeedbackOut)
def update_feedback(feedback_id: int, data: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if current_user.role != "manager" or feedback.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    feedback.strengths = data.strengths
    feedback.areas_to_improve = data.areas_to_improve
    feedback.sentiment = data.sentiment
    db.commit()
    db.refresh(feedback)
    return feedback

# --- Delete Feedback (Manager only) ---
@router.delete("/{feedback_id}")
def delete_feedback(feedback_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if current_user.role != "manager" or feedback.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(feedback)
    db.commit()
    return {"message": "Deleted successfully"}

# --- Acknowledge Feedback (Employee only) ---
@router.post("/{feedback_id}/acknowledge")
def acknowledge_feedback(feedback_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if current_user.role != "employee" or feedback.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    feedback.acknowledged = True
    db.commit()
    return {"message": "Acknowledged"}
