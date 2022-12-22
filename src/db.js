//import { config } from './config.js'; // for MySql
import { config } from './configSQLite.js'; //SQLite

import _knex from 'knex';

//console.log(config); //To verify if .env file is ok
export const knex = _knex(config)
