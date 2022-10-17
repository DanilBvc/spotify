import './App.css';
import React from 'react';
import axios from 'axios';

function App() {
  const CLIENT_ID = '9105c5aca2724045b9a2db55bc7432dd';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const [token, SetToken] = React.useState('');
  const [searchKey, SetSearchKey] = React.useState('');
  const [artist, SetArtist] = React.useState([]);

  const renderArtist = () => {
    return artist.map(item => (
      <div key={item.id}>
        {item.images.length ? (
          <img src={item.images[0].url} alt={item.id}></img>
        ) : (
          <div>No Photo</div>
        )}
        {item.name}
      </div>
    ));
  };


  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: 'artist',
      },
    });
    SetArtist(data.artists.items);
  };


  React.useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    SetToken(token);
  }, []);


  const logout = () => {
    SetToken('');
    window.localStorage.removeItem('token');
  };


  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        {token ? <form onSubmit={searchArtists}>
              <input
                onChange={(e) => {
                  SetSearchKey(e.target.value);
                }}
              ></input>
              <button type="submit">Search</button>
            </form>
             : <div>login</div>}
             {renderArtist()}
      </header>
    </div>
  );
}

export default App;
