import {gql, useQuery} from '@apollo/client'
import { useMutation } from '@apollo/client'
import Button from 'react-bootstrap/Button'
import {ScaleLoader} from 'react-spinners'
import Table from 'react-bootstrap/Table'
import { FaTrash } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { MdDone } from "react-icons/md"
import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GET_TODOS = gql`
query getTodos {
  todos {
    id,
    title,
    completed
  }
}
`
const DELETE_TODO = gql`
mutation deleteTodo($id: ID!) {
  deleteTodo(id: $id) {
    id,
    title,
    completed
  }
}
`
const ADD_TODO = gql`
mutation addTodo($title: String!, $completed: Boolean!) {
  addTodo(title: $title, completed: $completed) {
    id,
    title,
    completed
  }
}
`

const UPDATE_TODO = gql`
mutation updateTodo($id:ID!, $title:String!) {
  updateTodo(id:$id, title:$title) {
    id,
    title,
    completed
  }
}
`

const TOGGLE_TODO = gql`
mutation toggleTodo($id:ID!) {
  toggleTodo(id:$id) {
    id,
    title,
    completed
  }
}
`

export default function TodoList(){

    const [title, setTitle] = useState("")
    const completed = false

    const [editMode, setEditMode] = useState(false)
    const [editTodo, setEditTodo] = useState(null)
    const buttonTitle = editMode ? 'Edit' : "Add"

    const [addTodo] = useMutation(ADD_TODO, {
        variables: {title, completed},
        refetchQueries:[{query:GET_TODOS}],
        onCompleted: () => toast.success('Todo added successfully'),
        onError : (error) => toast.error(`Error adding todo: ${error.message}`)
    })


    const handleSubmit = (e) => {
        e.preventDefault();

        if(title === "")
            return toast.warn('Please fill in todo title')
        if(editMode){
            modifyTodo(editTodo.id)
            setEditMode(false)
            setEditTodo(null)
        }else{
            addTodo()
        }
        setTitle("")
    }

    const [deleteTodo] = useMutation(DELETE_TODO, {
        refetchQueries: [{ query: GET_TODOS }],
        onCompleted: () => toast.success('Todo deleted successfully!'),
        onError: (error) => toast.error(`Error deleting todo: ${error.message}`)
      });

      const removeTodo = (id) => {
        deleteTodo({
          variables: { id: id }
        });
      };

    const [updateTodo] = useMutation(UPDATE_TODO, {
        refetchQueries: [{ query: GET_TODOS }],
        onCompleted: () => toast.success('Todo updated successfully!'),
        onError: (error) => toast.error(`Error updating todo: ${error.message}`)
      });

      const modifyTodo = (id) => {
        updateTodo({
          variables: { id: id, title }
        });
      };

    const [toggleTodo] = useMutation(TOGGLE_TODO, {
        refetchQueries: [{ query: GET_TODOS }],
        onCompleted: () => toast.success('Todo status toggled!'),
        onError: (error) => toast.error(`Error toggling todo: ${error.message}`)
    })

    const markTodo = (id) => {
        toggleTodo({
        variables: { id: id }
        })
    }

    const {loading, error, data} = useQuery(GET_TODOS)


    return(
        <>
           <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Enter To Do"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                   {buttonTitle}
                </Button>
           </Form>
           {loading ? (
            <ScaleLoader
                height={35}
                width={4}
                color='#010a08'
                aria-label='scale-loading'
            />
                ) : error ? (
                    <p>Something went wrong</p>
                ) : (
            <div>
            {data.todos?.length === 0 ? (
                <p>No todos found.</p>
            ) : (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>To Do</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.todos.map((todo)=>(
                            <tr
                                key={todo.id}
                                className={`${todo.completed ? "text-decoration-line-through":""}`}
                            >
                                <td>{todo.title}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={()=>{
                                            setTitle(todo.title)
                                            setEditMode(true)
                                            setEditTodo(todo)
                                        }}
                                    >
                                        <FaEdit />
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={()=>{removeTodo(todo.id)}}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        variant="success"
                                        onClick={()=> markTodo(todo.id)}
                                    >
                                        <MdDone/>
                                    </Button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </Table>
            )}
        </div>
      )}
      <ToastContainer/>
        </>
    )
}
