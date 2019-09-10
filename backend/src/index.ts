import http from 'http';
import app from './app';

const server: http.Server = http.createServer(app);

server.listen(3001, () => {
  console.log('server running on port 3001');
});
