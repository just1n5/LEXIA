from celery import Celery
from app.core.config import settings

# Crear aplicación Celery
celery_app = Celery(
    "consulta_judicial",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.services.rpa.tasks"]
)

# Configuración de Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Bogota",
    enable_utc=True,
    task_track_started=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Configuración de tareas periódicas
celery_app.conf.beat_schedule = {
    'procesar-solicitudes-diarias': {
        'task': 'app.services.rpa.tasks.procesar_solicitudes_por_frecuencia',
        'schedule': 60.0 * 60.0 * 24.0,  # Cada 24 horas
        'args': ('diaria',)
    },
    'procesar-solicitudes-semanales': {
        'task': 'app.services.rpa.tasks.procesar_solicitudes_por_frecuencia',
        'schedule': 60.0 * 60.0 * 24.0 * 7.0,  # Cada 7 días
        'args': ('semanal',)
    },
    'procesar-solicitudes-mensuales': {
        'task': 'app.services.rpa.tasks.procesar_solicitudes_por_frecuencia',
        'schedule': 60.0 * 60.0 * 24.0 * 30.0,  # Cada 30 días
        'args': ('mensual',)
    },
}

# Habilitar beat scheduler
celery_app.conf.beat_scheduler = 'celery.beat:PersistentScheduler'
