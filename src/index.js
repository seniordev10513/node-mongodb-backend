#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from './app';
import socketIO from 'socket.io';
import fs from 'fs';
import http from 'http';
import os from 'os';
import cluster from 'cluster';
import 'dotenv/config';
import mongoose from 'mongoose';
var debug = require('debug')('ather:server');
// const {
//   createAdapter
// } = require("@socket.io/mongo-adapter");
// const {
//   setupMaster,
//   setupWorker
// } = require("@socket.io/sticky");

// const COLLECTION = "socket.io-adapter-events";
// const DB = "mjawesh";
// console.log(process.env)

// if (cluster.isMaster) {
//   var cpuCounts = os.cpus().length;
//   console.log('cpu counts ', cpuCounts)
//   console.log(`Master ${process.pid} is running`);
//
//   const httpServer = http.createServer();
//   // setup sticky sessions
//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection",
//   });
//
//
//
//   // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
//   // Node.js < 16.0.0
//   cluster.setupMaster({
//     serialization: "advanced",
//   });
//   httpServer.listen(3001);
//
//   for (let index = 0; index < cpuCounts; index++) {
//     cluster.fork();
//     console.log('index ', index);
//   }
//   cluster.on('exit', function(worker) {
//     console.log('Worker %d died :(', worker.id);
//     cluster.fork();
//   });
//
// } else {
//   console.log(`Worker ${process.pid} started`);

  var server = http.createServer(
    /*{
       key: fs.readFileSync('tajawal-ksa.com.key'),
       cert: fs.readFileSync('server.cert')
       },*/
    app);

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  /**
   * Create HTTP server.
   */
  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /** SOCKET*/
  var io = socketIO(server);

  // const main = async () => {
  //   mongoose.Promise = global.Promise;

    //forDJ-
    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: false,
      useNewUrlParser: true,
      autoIndex: false,
      ssl: true,
      tlsAllowInvalidHostnames: true,
      sslCA: fs.readFileSync(__dirname + '/ca.crt'),
      user: 'doadmin',
      pass: '80USEJ6Y74jC35A1'
    }


    mongoose.connect(process.env.MONGO_TURL, options)
    //-endforDJ-
    //-bfdj-
    //mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });

    //const autoIncrement = autoIncrementSQ(mongoose.connection);

    mongoose.connection.on('connected', () => {

      console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
    });
    mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
    mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...'));
    //
    // try {
    //   await mongoose.connection.createCollection(COLLECTION, {
    //     capped: true,
    //     size: 1e6
    //   });
    // } catch (e) {
    //   // collection already exists
    // }
    // const mongoCollection = mongoose.connection.collection(COLLECTION);
    // io.adapter(createAdapter(mongoCollection));
    // setupWorker(io);

    var socketService = require('./socketService/socketIoService');
    socketService.startNotification(io);
    socketService.chat(io);
    socketService.admin(io);

  // }
  //
  // main();

  /**
   * Normalize a port into a number, string, or false.
   */
// }

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}
//}
