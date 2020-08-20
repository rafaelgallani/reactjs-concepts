import React, { useState, useEffect } from "react";
import api from './services/api'
import { v4 as generateId } from "uuid";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(result => {
      setRepositories(result.data)
    }).catch(err => {
      console.error(`Error deleting => ${err}`)
    })
  }, [])

  async function handleAddRepository() {
    api.post('/repositories', {
      title: `Repository ${generateId()}`,
    }).then(result => {
      setRepositories([...repositories, result.data])
    }).catch(err => {
      console.error(`Error adding => ${err}`)
    })
  }

  async function handleRemoveRepository(id) {
    api.delete(`/repositories/${id}`).then(result => {
      if (result.status == 204){
        setRepositories(repositories.filter(repository => repository.id !== id))
      }
    }).catch(err => {
      console.error(`Error deleting => ${err}`)
    })
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => {
          console.log(repositories)
          return <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
          </li>
        })}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
