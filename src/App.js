import React, { useState, useEffect } from "react";
import api from './services/api'
import { v4 as generateId } from "uuid";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    var getRepositoriesData = async () => {
      try {
        const result = await api.get('/repositories');
        setRepositories(result.data)
      } catch(err){
        console.error(`Error getting => ${err}`)  
      }
    }

    getRepositoriesData();
  }, [])

  async function handleAddRepository() {
    try {
      const result = await api.post('/repositories', {
        title: `Repository ${generateId()}`,
      });
      if (result.status.toString().startsWith('2')){  //changed status according to the unit tests
        setRepositories([...repositories, result.data])
      }
    } catch(err){
      console.error(`Error deleting => ${err}`)
    }
  }

  async function handleRemoveRepository(id) {
    try {
      const result = await api.delete(`/repositories/${id}`);
      if (result.status === 204){
        setRepositories(repositories.filter(repository => repository.id !== id))
      }
    } catch(err) {
      console.error(`Error deleting => ${err}`)
    }
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
