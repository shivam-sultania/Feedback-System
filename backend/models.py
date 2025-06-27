from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # "manager" or "employee"

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    strengths = Column(String)
    areas_to_improve = Column(String)
    sentiment = Column(String)  # "positive", "neutral", "negative"

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    acknowledged = Column(Boolean, default=False)

    manager_id = Column(Integer, ForeignKey("users.id"))
    employee_id = Column(Integer, ForeignKey("users.id"))

    manager = relationship("User", foreign_keys=[manager_id], backref="given_feedbacks")
    employee = relationship("User", foreign_keys=[employee_id], backref="received_feedbacks")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    manager_id = Column(Integer, ForeignKey("users.id"))
    employee_id = Column(Integer, ForeignKey("users.id"))

    manager = relationship("User", foreign_keys=[manager_id], backref="assigned_employees")
    employee = relationship("User", foreign_keys=[employee_id], backref="assigned_manager")