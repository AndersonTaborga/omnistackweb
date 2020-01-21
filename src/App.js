import React, { useState, useEffect } from 'react';
import api from './services/api';
import DevItem from './components/DevItem/index';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';


// Componente: (Função que retorna todo conteudo HTML e CSS) 
// Propriedade: Informações que um componente pai para o componente filho
// Estado: Informações mantidas pleo componente (Lembrar: imutabilidade)


function App() { //JSX
  const [devs, setDevs] = useState([]);
  
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLaLitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude} = position.coords;

        setLaLitude(latitude);
        setLongitude(longitude);
      },
      (err) =>{
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  },[]);

  useEffect(() =>{
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);

    }
    loadDevs();
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    })

    setGithubUsername('');
    setTechs('');

    setDevs([...devs, response.data]);

  }

  return (
    <div id="app">
      <aside>
      <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
              <label htmlFor="github-username">Usuário do Github</label>
              <input 
              name="github_username" 
              id="github_username" 
              required
              value={github_username}
              onChange={e => setGithubUsername(e.target.value)}
              />
          </div>

          <div className="input-block">
              <label htmlFor="techs">Tecnologias</label>
              <input 
              name="techs" 
              id="techs" 
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
              />
          </div>

          <div className="input-group"> 
            <div className="input-block">
                <label htmlFor="latitude">Latitude</label>
                <input 
                type="number" 
                name="latitude" 
                id="latitude" 
                required 
                value={latitude}
                onChange={e => setLaLitude(e.target.value)}/>
            </div>

            <div className="input-block">
                <label htmlFor="longitude">Longitude</label>
                <input 
                type="number" 
                name="longitude" 
                id="longitude" 
                required 
                value={longitude}
                onChange={e => setLongitude(e.target.value)}/>
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            < DevItem  key={dev._id} dev={dev} />
          ))}
          
        </ul>
      </main>
    </div>
  )
};

export default App;
