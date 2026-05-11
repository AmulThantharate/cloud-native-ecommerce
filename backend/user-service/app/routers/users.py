from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import timedelta

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token
from app.models.user import User
from app.models.address import Address

router = APIRouter(prefix="/users", tags=["users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

# Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    role: str
    createdAt: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class AddressCreate(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str
    country: str = "US"
    isDefault: bool = False

class AddressResponse(AddressCreate):
    id: str

# Helpers
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def user_to_response(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "role": user.role,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
    }

# Endpoints
@router.post("/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        first_name=user_data.firstName,
        last_name=user_data.lastName,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"sub": db_user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_to_response(db_user),
    }

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_to_response(user),
    }

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    firstName: Optional[str] = None,
    lastName: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if firstName:
        current_user.first_name = firstName
    if lastName:
        current_user.last_name = lastName
    db.commit()
    db.refresh(current_user)
    return user_to_response(current_user)

@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users = db.query(User).offset(skip).limit(limit).all()
    return [user_to_response(u) for u in users]

# Address endpoints
@router.post("/addresses", response_model=AddressResponse)
def create_address(
    address: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_address = Address(
        user_id=current_user.id,
        street=address.street,
        city=address.city,
        state=address.state,
        zip_code=address.zipCode,
        country=address.country,
        is_default=address.isDefault,
    )
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return {
        "id": db_address.id,
        "street": db_address.street,
        "city": db_address.city,
        "state": db_address.state,
        "zipCode": db_address.zip_code,
        "country": db_address.country,
        "isDefault": db_address.is_default,
    }

@router.get("/addresses", response_model=List[AddressResponse])
def list_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    return [{
        "id": a.id, "street": a.street, "city": a.city, "state": a.state,
        "zipCode": a.zip_code, "country": a.country, "isDefault": a.is_default,
    } for a in addresses]
