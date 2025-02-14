import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTodo from "./AddTodo";

import { ClientSideRowModelModule } from "ag-grid-community";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function App() {
  const [todos, setTodos] = useState([]);

  const columnDefs = [
    { field: "description", sortable: true, filter: true },
    { field: "date", sortable: true, filter: true },
    { field: "priority", sortable: true, filter: true },
    { 
      headerName: "Delete", 
      field: "id", 
      width: 90, 
      cellRenderer: (params) => (
        <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      ) 
    }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch(
      "https://todolist-f6b80-default-rtdb.europe-west1.firebasedatabase.app/items/.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); 

        if (!data) {
          console.warn("No items found in Firebase response.");
          setTodos([]);
          return;
        }

        addKeys(data); 
      })
      .catch((err) => console.error("Fetch error:", err));
  };


  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => ({
      ...item,
      id: keys[index],
    }));
    setTodos(valueKeys);
  };


  const addTodo = (newTodo) => {
    fetch(
      "https://todolist-f6b80-default-rtdb.europe-west1.firebasedatabase.app/items/.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(newTodo),
      }
    )
      .then(() => fetchItems()) 
      .catch((err) => console.error(err));
  };

  const deleteTodo = (id) => {
    fetch(
      `https://todolist-f6b80-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => fetchItems()) 
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">TodoList</Typography>
        </Toolbar>
      </AppBar>
      
      <AddTodo addTodo={addTodo} />

      <div className="ag-theme-material" style={{ height: 400, width: 700 }}>
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowModelType="clientSide"
          rowData={todos}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;
