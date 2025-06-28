from fastapi import FastAPI, Depends
from database import Base, engine
from routers import login_reg, feedback, team
from models import User
from routers.feedback import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(login_reg.router)
app.include_router(feedback.router)
app.include_router(team.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(os.getenv("Authorized_URL"))],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/whoami")
def who_am_i(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role
    }
