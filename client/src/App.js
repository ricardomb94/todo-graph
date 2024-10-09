import 'bootstrap/dist/css/bootstrap.min.css'
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client'
import TodoList from './components/TodoList.js';
import {Container} from 'react-bootstrap'

const client = new ApolloClient({
  uri:'http://localhost:8000/graphql', 
  cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Container >
        <h1 className="text-center mt-3">Todo App</h1>
        <TodoList/>
      </Container>
    </ApolloProvider>
  );
}

export default App;
