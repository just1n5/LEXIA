from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.solicitud_consulta import SolicitudConsulta
from app.models.resultado_consulta import ResultadoConsulta
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Modelos Pydantic
class SolicitudCreate(BaseModel):
    alias: str
    tipo_busqueda: str
    criterio_busqueda_radicado: str = None
    criterio_busqueda_nombre: str = None
    frecuencia_envio: str

class SolicitudUpdate(BaseModel):
    alias: str = None
    frecuencia_envio: str = None
    activa: bool = None

class SolicitudResponse(BaseModel):
    id: str
    alias: str
    tipo_busqueda: str
    frecuencia_envio: str
    fecha_creacion: datetime
    activa: bool
    ultima_ejecucion: datetime = None

class ResultadoResponse(BaseModel):
    id: str
    fecha_ejecucion: datetime
    numero_radicado_completo: str
    despacho_juzgado: str
    fecha_ultimo_auto: datetime = None
    estado_extraccion: str

@router.get("/", response_model=List[SolicitudResponse])
async def get_solicitudes(
    skip: int = 0,
    limit: int = 100,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener todas las solicitudes del usuario"""
    solicitudes = db.query(SolicitudConsulta).filter(
        SolicitudConsulta.usuario_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return solicitudes

@router.post("/", response_model=SolicitudResponse)
async def create_solicitud(
    solicitud_data: SolicitudCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nueva solicitud de consulta"""
    new_solicitud = SolicitudConsulta(
        usuario_id=current_user.id,
        alias=solicitud_data.alias,
        tipo_busqueda=solicitud_data.tipo_busqueda,
        criterio_busqueda_radicado=solicitud_data.criterio_busqueda_radicado,
        criterio_busqueda_nombre=solicitud_data.criterio_busqueda_nombre,
        frecuencia_envio=solicitud_data.frecuencia_envio
    )
    
    db.add(new_solicitud)
    db.commit()
    db.refresh(new_solicitud)
    
    # TODO: Disparar tarea de RPA para primera ejecución
    
    return new_solicitud

@router.get("/{solicitud_id}", response_model=SolicitudResponse)
async def get_solicitud(
    solicitud_id: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener solicitud específica"""
    solicitud = db.query(SolicitudConsulta).filter(
        SolicitudConsulta.id == solicitud_id,
        SolicitudConsulta.usuario_id == current_user.id
    ).first()
    
    if not solicitud:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    return solicitud

@router.put("/{solicitud_id}", response_model=SolicitudResponse)
async def update_solicitud(
    solicitud_id: str,
    solicitud_data: SolicitudUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar solicitud existente"""
    solicitud = db.query(SolicitudConsulta).filter(
        SolicitudConsulta.id == solicitud_id,
        SolicitudConsulta.usuario_id == current_user.id
    ).first()
    
    if not solicitud:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    # Actualizar campos
    for field, value in solicitud_data.dict(exclude_unset=True).items():
        setattr(solicitud, field, value)
    
    db.commit()
    db.refresh(solicitud)
    
    return solicitud

@router.delete("/{solicitud_id}")
async def delete_solicitud(
    solicitud_id: str,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar solicitud"""
    solicitud = db.query(SolicitudConsulta).filter(
        SolicitudConsulta.id == solicitud_id,
        SolicitudConsulta.usuario_id == current_user.id
    ).first()
    
    if not solicitud:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    db.delete(solicitud)
    db.commit()
    
    return {"message": "Solicitud eliminada exitosamente"}

@router.get("/{solicitud_id}/resultados", response_model=List[ResultadoResponse])
async def get_resultados_solicitud(
    solicitud_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener resultados de una solicitud"""
    # Verificar que la solicitud pertenece al usuario
    solicitud = db.query(SolicitudConsulta).filter(
        SolicitudConsulta.id == solicitud_id,
        SolicitudConsulta.usuario_id == current_user.id
    ).first()
    
    if not solicitud:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada"
        )
    
    resultados = db.query(ResultadoConsulta).filter(
        ResultadoConsulta.solicitud_id == solicitud_id
    ).order_by(ResultadoConsulta.fecha_ejecucion.desc()).offset(skip).limit(limit).all()
    
    return resultados
