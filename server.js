const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

// Create a new todo
app.post("/todos", (req, res) => {
  const { name, description, completed } = req.body

  if (!name) {
    return res.status(400).json({ error: "todo name cannot be empty" })
  }

  db.run(
    "INSERT INTO todos (name, description, completed) VALUES (?, ?, ?)",
    [name, description, completed],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.status(201).json({ id: this.lastID, name, description, completed })
    }
  )
})

// Get all todos
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(rows)
  })
})

// Get a todo by ID
app.get("/todos/:id", (req, res) => {
  const id = req.params.id

  db.get("SELECT * FROM todos WHERE id = ?", id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!row) {
      return res.status(404).json({ error: "todo not found" })
    }

    res.json(row)
  })
})

// Update a todo by ID
app.put("/todos/:id", (req, res) => {
  const { name, description, completed } = req.body
  const id = req.params.id

  db.get("SELECT * FROM todos WHERE id = ?", [id], (err, existingTodo) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }

    const updatedName = name !== null ? name : existingTodo.name
    const updatedDescription =
      description !== null ? description : existingTodo.description
    const updatedCompleted =
      completed !== null ? completed : existingTodo.completed

    db.run(
      "UPDATE todos SET name = ?, description = ?, completed = ? WHERE id = ?",
      [updatedName, updatedDescription, updatedCompleted, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        res.json({
          id,
          name: updatedName,
          description: updatedDescription,
          completed: updatedCompleted,
        })
      }
    )
  })
})

// Delete a todo by ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id

  db.run("DELETE FROM todos WHERE id = ?", id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json({ message: "todo deleted", id })
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
