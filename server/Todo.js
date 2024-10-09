import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
        title:{
            type:String
        },
        completed:{
            type:Boolean
        }
    },
    {timestamps:true}
)

const Todo = mongoose.model('Todo', TodoSchema)

export default Todo