from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Modelos Pydantic
class UserProfileUpdate(BaseModel):
    nombre: str = None
    email: EmailStr = None

class UserProfileResponse(BaseModel):
    id: str
    nombre: str
    email: str
    tipo_cuenta: str
    fecha_creacion: str
    activo: bool

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: Usuario = Depends(get_current_user)):
    """Obtener perfil del usuario actual"""
    return current_user

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar perfil del usuario"""
    # Verificar si el nuevo email ya existe (si se está cambiando)
    if profile_data.email and profile_data.email != current_user.email:
        existing_user = db.query(Usuario).filter(Usuario.email == profile_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está en uso"
            )
    
    # Actualizar campos
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.delete("/profile")
async def delete_user_account(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar cuenta de usuario"""
    # En lugar de eliminar completamente, desactivar la cuenta
    current_user.activo = False
    db.commit()
    
    return {"message": "Cuenta desactivada exitosamente"}
