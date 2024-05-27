const env = require('dotenv');
env.config({ path: './config.env' });

const moviesApp = require('./movies/app');

//Create a server
const portnumber = process.env.PORT || 3000;

// console.log(moviesApp.get('env'))
// console.log(process.env)

moviesApp.listen(portnumber, '127.0.0.1', () => {
    console.log("--------Server started on portnumber: 3000------");
})