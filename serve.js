const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Define la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Obtén la extensión del archivo
  const extname = path.extname(filePath);

  // Tipo de contenido predeterminado
  let contentType = 'text/html';

  // Mapear las extensiones a los tipos MIME
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  // Establecer el tipo de contenido según la extensión
  contentType = mimeTypes[extname] || contentType;

  // Leer el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Página no encontrada
        fs.readFile(path.join(__dirname, '404.html'), (error, errorContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(errorContent || '<h1>404 - Página no encontrada</h1>', 'utf-8');
        });
      } else {
        // Error del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      // Servir el archivo
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
