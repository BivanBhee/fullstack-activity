import express from "express";
import sql from "./db.js";
import cors from "cors"

const app = express();

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
);
app.use(express.json())

app.get("/api/todos", async (req, res) => {
    const todos = await sql`SELECT * FROM todos`
    console.log(todos)
    if (todos){
        res.status(200).send(todos)
    }
    else {
        res.status(500).send("Unable to insert")
    }
})

app.put("/api/todos", async (req, res) => {
    const todoId  = req.params.id;

    try {    
        await sql`UPDATE FROM todos WHERE id = ${todoId}`;
        res.status(204).send();
    } catch (error) {
        console.error("Yet to be updated:", error)
        res.status(500).json({error: "Error"})
    }
});

app.delete("/api/todos/:id", async (req, res) => {
    const todoId = req.params.id;

    try {
      await sql`DELETE FROM todos WHERE id = ${todoId}`;
      res.status(204).send("Sucessfully deleted "); // No content response for successful deletion
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.post("/api/todos2", async (req, res) => {
    const { task, is_completed } = req.body
    const todos2 = await sql `INSERT INTO todos (task, is_completed) VALUES (${task}, ${is_completed}) RETURNING *`
    console.log(todos2)
    if (todos2){
        res.status(201).send(todos2)
    }
    else {
        res.status(500).send("Ooops! Error")
    }
}
)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});