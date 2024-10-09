import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';
import Todo from './Todo.js'

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
    }
});

const RootQueryType   
 = new GraphQLObjectType({
    name: 'Query',
    fields: {
        todos: {
            type: new GraphQLList(TodoType),   

            resolve: async (root, args) => {
                const result = await Todo.find();
                console.log("***RESULT***" ,result);
                
                return result
            }
        },
        todo:{
            type:TodoType,
            args:{id:{type:GraphQLID}},
            resolve: (root, args) => {
                return Todo.findById(args.id)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addTodo:{
            type: TodoType,
            args:{
                title:{type: GraphQLNonNull(GraphQLString)},
                completed: {type: GraphQLNonNull(GraphQLBoolean)},
            },
            resolve(parent,args) {
                const todo = new Todo({
                    title:args.title,
                    completed:false
                })
                return todo.save()
            }
        },
        deleteTodo:{
            type: TodoType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args) {
                return Todo.findByIdAndDelete(args.id)
            }
        },
        updateTodo:{
            type: TodoType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const updatedTodo = await Todo.findByIdAndUpdate(
                        args.id,
                        { $set: { title: args.title } },
                        { new: true }
                    );
                    if (!updatedTodo) {
                        throw new Error('Todo not found');
                    }
                    return updatedTodo;
                } catch (err) {
                    console.error('Failed to update todo:', err);
                    throw new Error('Failed to update todo: ' + err.message);
                }
            }
        },
        toggleTodo:{
            type:TodoType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args){
                const todo = await Todo.findById(args.id)
                return Todo.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            completed:!todo.completed
                        }
                    }
                )
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: mutation 
});

export default schema















