import server from './server'

const port = process.env.PORT || 4000

server.listen(() => {
  console.log(`Escuchando por el puerto ${port}`);
})