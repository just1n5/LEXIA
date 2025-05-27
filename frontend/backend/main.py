from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, usuarios, solicitudes

# Crear aplicación FastAPI
app = FastAPI(
    title="Consulta Judicial RPA API",
    description="API para automatización de consultas de procesos judiciales",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(usuarios.router, prefix="/api/v1/usuarios", tags=["usuarios"])
app.include_router(solicitudes.router, prefix="/api/v1/solicitudes", tags=["solicitudes"])

@app.get("/")
async def root():
    return {"message": "Consulta Judicial RPA API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
