const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./todos.db")

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, completed BOOLEAN)"
  )
})

module.exports = db
