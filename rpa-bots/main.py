#!/usr/bin/env python3
"""
Script principal para ejecutar workers RPA independientes
"""
import os
import sys
from dotenv import load_dotenv
from src.scrapers.rama_judicial.scraper import RamaJudicialScraper
from src.utils.logger import setup_logger

# Cargar variables de entorno
load_dotenv()

def main():
    """Función principal para pruebas manuales del scraper"""
    logger = setup_logger("rpa_main")
    
    try:
        logger.info("Iniciando scraper de prueba...")
        
        scraper = RamaJudicialScraper()
        
        # Ejemplo de consulta por número de radicado
        numero_radicado = "11001000000020240000001"  # Ejemplo
        
        resultado = scraper.consultar_por_radicado(numero_radicado)
        
        if resultado:
            logger.info(f"Consulta exitosa: {resultado}")
        else:
            logger.warning("No se encontraron resultados")
            
    except Exception as e:
        logger.error(f"Error en ejecución principal: {e}")
        sys.exit(1)
    
    logger.info("Ejecución completada")

if __name__ == "__main__":
    main()
