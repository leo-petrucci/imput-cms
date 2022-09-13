import initSqlJs from "sql.js";
import wasmModule from 'https://sql.js.org/dist/sql-wasm.wasm?module';

const initDb = async () => {

  const { exports } = (await WebAssembly.instantiate(wasmModule)) as any;
  
  // Create a database
  const db = new SQL.Database();
  // NOTE: You can also use new SQL.Database(data) where
  // data is an Uint8Array representing an SQLite database file

  return db;
};

export default initDb;
