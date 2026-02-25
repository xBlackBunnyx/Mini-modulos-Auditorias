# Mini Modulo de Auditorias
Este proyecto consiste en una prueba técnica para InnAudit enfocada principalmente al desarrollo web.

Para la elaboración de este proyecto, se ha usado Vue JS en la versión 3, así como Vuetify 3, siendo estas las últimas versiones de ambos. Asimismo, el código ha sido escrito usando JavaScript. 

Se ha decidido usar estas herramientas, ya que son familiares, ya que he trabajado previamente con ellas.

Así, decir también que, para la elaboración de este proyecto, se ha utilizado IA generativa para la elaboración del dataset, así como para debuggear. También se ha usado la documentación oficial de Vuetify 3 (https://vuetifyjs.com/en/getting-started/installation/#installation) y foros y tutoriales online.

## Requisitos
Para poder correr el proyecto, es necesario tener disponibles todas las dependencias. Además, para la creación del backend, se ha empleado la librería de json-server a modo de base de datos

## Cómo correr el proyecto
El proyecto se ha estado corriendo en local tomando como ruta principal la carpeta donde se encuentra el proyecto (Mini-modulos-Auditoria)
Teniendo esto en cuenta, para ejecutar el backend, es necesario escribir en la terminal donde se ejecute el proyecto (en mi caso, en la terminal de Virtual Studio Code) el comando:
json-server .\src\data\DB.json --port 3000
En otra terminal distinta, para activar el frontend como tal, hay que usar el comando: npm run dev 

## Cosas que no han podido completarse y mejoras
Dada la poca experiencia de su creadora en el desarrollo web, han habido diferentes dificultades y muchas cosas se han quedado sin poder realizarse.
- Las tablas de las auditorías y los detalles de esta no responden correctamente al cambio de resolución. Concretamente, la tabla de los detalles de auditoría no ocupa todo el espacio que podría ocupar en resoluciones altas
- Es posible que la búsqueda de los filtros de las auditorías no funcionen correctamente y solo filtren si los términos son exactamente iguales
-Tampoco se ha podido hacer que la API falle 
-El botón de refrescar no funciona correctamente si la base de datos no está activa
- La adición de una nueva auditoría no funciona correctamente. Si es una nueva auditoría completamente, se añade una id extra además de la id de la auditoría. Si es una auditoría existente, en lugar de actualizar la lista anterior, se vuelve a añadir una nueva entrada en el DB.json repitiendo la id de la auditoría en cuestión y vuelve a mostrar todos los checks anteriores
-No ha sido posible actualizar el progreso de la auditoría

En caso de tener más tiempo, se intentaría arreglar todos los problemas mencionados, además de poder aplicarle un estilo general a la página web, para que sea más atractiva visualmente.

