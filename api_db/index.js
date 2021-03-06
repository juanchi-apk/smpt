const server = require('./ExpressServer/index');
const { conn } = require('./db/index');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
    console.log("estamosaca")
  server.listen( 3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  })
})
  .catch((err) =>{
      return err;
  })
 