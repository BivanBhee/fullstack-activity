import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const taskRef = useRef();

  const [todos, setTodos] = useState([]);
  const [taskInputValue, setTaskInputValue] = useState("");
  const [edittingTaskId, setEdittingTaskId] = useState(null);
  const [edittingTask, setEdittingTask] = useState({});

  useEffect(() => {
    async function fetchTodos() {
      try {
  
        const response = await fetch("http://localhost:3000/api/todos");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchTodos();
  }, []);

  async function handleAddTodoSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/todos2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: taskInputValue,
          is_completed: false,
        }),
      });
      const data = await response.json();

      setTaskInputValue("");
      setTodos((todos) => todos.concat(data));
    } catch (error) {}
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted item from the local state (todos)
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function handleEdit(id) {
    try {
      const response = await fetch(`http:/localhost:3000/api/todos/${id}`, {
        method: "PUT", 
        // The PUT method helps to edit a task
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: edittingTask.task,
          is_completed: edittingTask.is_completed,    
        }),
      });

      if (response.ok) {
        // Update the task in the local state (todos)
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, task: edittingTask } : todo
          )
        );

        // Reset edit state
        cancelEdit();
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-purple-500 font-bold text-5xl mt-5 mb-10">
        My_ToDo_List
      </h1>
      <form onSubmit={handleAddTodoSubmit} className="mb-10">
        <div className="flex">
          <input
            className="border p-3 flex-1 rounded-1"
            type="text"
            name="task"
            value={taskInputValue}
            onChange={(event) => {
              setTaskInputValue(event.target.value);
            }}
            placeholder="Next task..."
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-r  hover:bg-purple-800 font-bold"
          >
            Done
          </button>
        </div>
      </form>
      <ol className="list-disc p-4">
        {todos.map((todo, i) => (
          <li key={i} className="flex items-center mb-2 font-bold">
            <input
              type="checkbox"
              className="ml-1 form-checkbox h-3 w-3 text-purple-500"
            />
            <span className="flex-1">{todo.task}</span>
            <button
            type="submit"
            onClick={() => startEdit(todo.id)}
            className="text-purple-500 hover:text-purple-800 border pt-1 pb-1 pr-2 pl-2 rounded-md bg-slate-300 mr-5"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteItem(todo.id)}
              className="text-red-600 hover:text-red-800 border p-1 rounded-md bg-slate-200"
            >
              Remove
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;


