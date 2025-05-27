// ✅ EJEMPLOS DE PRUEBAS PARA BÚSQUEDA SIN TILDES

/* 
🧪 CASOS DE PRUEBA - SearchInputEnhanced con normalización:

1. TILDES EN SUGERENCIAS:
   - Escribir "Maria" → debe mostrar "María García" en sugerencias
   - Escribir "Garcia" → debe mostrar "María García" 
   - Escribir "jose" → debe mostrar "José" o "José Luis"
   - Escribir "lopez" → debe mostrar "López"

2. TILDES EN BÚSQUEDA PRINCIPAL:
   - Escribir "garcía" → debe encontrar "García Pérez"
   - Escribir "María" → debe encontrar "maria" 
   - Escribir "perez" → debe encontrar "Pérez"
   - Escribir "razon" → debe encontrar "Razón Social"

3. CARACTERES ESPECIALES:
   - Escribir "consultajudicial" → debe encontrar "Consulta Judicial"
   - Escribir "numero" → debe encontrar "Número"
   - Escribir "expediente123" → debe funcionar normalmente

4. CASOS EDGE:
   - Texto vacío → no mostrar sugerencias
   - Solo espacios → no mostrar sugerencias  
   - Tildes múltiples → normalizar correctamente
   - MAYÚSCULAS → ignorar case sensitivity

5. HIGHLIGHT DE RESULTADOS:
   - Búsqueda "maria" + sugerencia "María García" → highlight correcto
   - Mantener tildes originales en el resultado mostrado
   - Highlight debe respetar acentos del texto original

RESULTADO ESPERADO:
✅ Buscar "Garcia" encuentra "García"
✅ Buscar "María" encuentra "Maria"  
✅ Buscar "lopez" encuentra "López"
✅ Buscar "PEREZ" encuentra "pérez"
✅ Highlight mantiene tildes originales
✅ Sugerencias funcionan sin tildes
✅ Performance igual o mejor que antes
*/