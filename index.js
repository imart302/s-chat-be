require('dotenv').config();
const { server } = require('./app');
const { dbConnection } = require('./db/config');


dbConnection().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
})
.catch((error) => {
  
});


