### Comandos utilizados

Forever:
-Ejecución en modo fork ---> forever start ./src/server.js -p=8080 -m=fork
-Ejecución en modo cluster ---> forever start ./src/server.js -p=8080 -m=cluster
-Listar procesos por pm2 ---> forever list

PM2:
-Ejecución en modo fork ---> pm2 start ./src/server.js --watch -- -p=8080
-Ejecución en modo cluster ---> pm2 start ./src/server.js --watch -i max -- -p=8080
-Listar procesos por pm2 ---> pm2 list

NGINX:

- Consigna 1:

  - Usar la primera configuracion de nginx.conf
  - /api/randoms escuchando en cluster en 8081 --> node ./src/server.js -p 8081 -m cluster
  - resto de consultas a 8080 --> node ./src/server.js -p 8080

- Consigna 2:
  - Usar la segunda configuracion de nginx.conf
  - /api/randoms en 4 servidores:
    - pm2 start ./src/server.js -p 8082
    - pm2 start ./src/server.js -p 8083
    - pm2 start ./src/server.js -p 8084
    - pm2 start ./src/server.js -p 8085
