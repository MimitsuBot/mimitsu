import 'dotenv/config';
import Client from './src/Client';
import { readFileSync } from 'fs';

const client = new Client();

console.log(readFileSync('Mimitsu.txt', 'utf8').toString());

client
  .on('disconnect', () => console.log('Connection lost'))
  .on('reconnect', () => console.log('Attempting to reconnect'))
  .on('error', err => console.error(err))
  .on('warn', info => console.log(info));

client.start();
