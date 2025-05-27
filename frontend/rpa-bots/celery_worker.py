from celery import Celery
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de Celery para workers RPA
celery_app = Celery(
    'rpa_worker',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
    include=['src.workers.tasks']
)

# Configuración de Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Bogota',
    enable_utc=True,
    task_track_started=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,  # Reiniciar worker después de 100 tareas
    task_soft_time_limit=300,  # 5 minutos límite suave
    task_time_limit=600,  # 10 minutos límite duro
    task_default_retry_delay=60,  # 1 minuto entre reintentos
    task_max_retries=3,
)

if __name__ == '__main__':
    celery_app.start()
