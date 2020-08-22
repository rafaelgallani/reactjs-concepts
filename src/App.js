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

  function getLikesLabel (likes) {
    if (likes>1) return `${likes} curtidas`
    if (likes==1) return `${likes} curtida`
    else return `Nenhuma curtida`
  }

  function setRepositoryLikes({id, likes}) {
    setRepositories(repositories.map(a => {
        if (a.id === id) return {...a, likes }
        return a;
      })
    );
  }

  async function handleLikeRepository(id) {
    try {
      const result = await api.post(`/repositories/${id}/like`, {});
      if (result.status.toString().startsWith('2')){
        const repository = result.data;
        setRepositoryLikes(repository);
      }
    } catch(err){
      console.error(`Error liking => ${err}`)
    }
  }

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
            {repository.title} - {getLikesLabel(repository.likes)}
            <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
            <button onClick={() => handleLikeRepository(repository.id)}>+1</button>
          </li>
        })}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
