import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import {
    useGetTodosQuery,
    useAddTodoMutation,
    useDeleteTodoMutation,
    useUpdateTodoMutation,
    useToggleAllTodosMutation,
    useDeleteAllTodosMutation
} from '../api/apiSlice';
import { Audio } from 'react-loader-spinner';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';



const TodoList = () => {
    const [newTodo, setNewTodo] = useState('');
    const [whichUser,setWhichUser] = useState('');
    const [checkAll,setCheckAll] = useState();

    const {
        data:todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery();

   
   

    const [addTodo] = useAddTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();
    const [toggleAllTodos] = useToggleAllTodosMutation();
    const [deleteAllTodos] = useDeleteAllTodosMutation();
   

    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo({userId:whichUser,title:newTodo,completed:false});
        setNewTodo('');
        setWhichUser('');
    }

    const handleCheckAll = () => {
        toggleAllTodos(checkAll);
        setCheckAll(!checkAll);
      };

    const canSaveTodo = newTodo && /^[0-9]+$/.test(whichUser);

    const newItemSection =
        <FormGroup >
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                    style={{  marginBottom: "10px"}}
                    required
                />

                <input
                    type="text"
                    id="new-todo"
                    value={whichUser}
                    onChange={(e) => setWhichUser(e.target.value)}
                    placeholder="Enter userId"
                    required
                />

                {isSuccess && todos.length>0 && 
                <FormControlLabel control={<Checkbox checked = {checkAll} onChange={handleCheckAll}/>} label="Check All" />}
            </div>
          

          
        <div className="button-container">

            <button className="submit" type = "submit" onClick={handleSubmit} disabled = {!canSaveTodo}>
                <FontAwesomeIcon icon={faUpload} />
            </button>

            {isSuccess && todos.length>0 &&<button type = "button" className="trash" onClick={() => deleteAllTodos()}>
                <FontAwesomeIcon icon={faTrash} />
                 Delete All
            </button>}

                
        </div>
          
        </FormGroup>


    let content;
    if(isLoading){
        content = <div className = "statusMsg">
                        <p>Loding todos...</p>
                        <Audio
                        height="80"
                        width="80"
                        radius="9"
                        color="green"
                        ariaLabel="loading"
                        />
                    </div>
    }else if(isSuccess){
        content = todos.map(todo=>{
            return (
                <article key = {todo.id}>
                    <div className="todo">
                        <input
                            type = "checkbox"
                            checked = {todo.completed}
                            id = {todo.id}
                            onChange={()=>updateTodo({id:todo.id})}/>
                        <label htmlFor={todo.id} className={todo.completed ? "completed" : ""}>
                            {todo.title}
                        </label>
                    </div>
                    <button className="trash" onClick={()=>deleteTodo({id:todo.id})}>
                        <FontAwesomeIcon icon = {faTrash} />
                    </button>
                </article>
            )
        })
    }else{
        content = <p className = "statusMsg">{error}</p>
    }

    const errorMsg = <p className="error">Unexpected Error</p>

  

    return (
        <main>
            {todos ?
             <>
                <h1>Todo List</h1>
            {newItemSection}
            {content}
            </>
                
            :

            errorMsg}


           
           
           
        </main>
    )
}
export default TodoList