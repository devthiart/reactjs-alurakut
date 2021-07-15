import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  console.log(props);
  return (
    <Box as='aside'>
      <img src={ `https://www.github.com/${props.githubUser}.png` } style={{ borderRadius: '8px' }}/>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>{props.githubUser}</a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.items.length})</h2>
      <ul>
        {props.items.slice(0, 6).map(
            (item) => {
              return (
                <li key={item.login}>
                  <a href={`/users/${item.login}`} key={item.login}>
                    <img src={`https://github.com/${item.login}.png`} />
                    <span>{item.login}</span>
                  </a>
                </li>
              );
            }
        )}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = 'devthiart';
  const [comunidades, setComunidades] = React.useState([{
    id: '145154145145154514',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);;
  const pessoasFavoritas = [
    'juunegreiros', 
    'omariosouto', 
    'rafaelrcapuano',
    'filipedeschamps',
    'peas', 
    'rafaballerini', 
    'marcobrunodev', 
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {
    fetch('https://api.github.com/users/devthiart/followers')
    .then(resp => {
      if(resp.ok === true){
        return resp.json();
      }
      throw new Error("Não foi possível acessar a API. Status: " + resp.status);
    })
    .then(resp => {
      setSeguidores(resp);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1>Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2>O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image')
              }

              if(comunidade.image == "") {
                comunidade.image = 'https://via.placeholder.com/300';
              }

              const comunidadesAtualizadas = [...comunidades, comunidade]
              setComunidades(comunidadesAtualizadas);
              console.log(comunidades);
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.slice(0, 6).map(
                  (comunidade) => {
                    return (
                      <li key={comunidade.id}>
                        <a href={`/users/${comunidade.title}`} key={comunidade.title}>
                          <img src={comunidade.image} />
                          <span>{comunidade.title}</span>
                        </a>
                      </li>
                    );
                  }
              )}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.slice(0, 6).map(
                  (pessoa) => {
                    return (
                      <li key={pessoa}>
                        <a href={`/users/${pessoa}`} key={pessoa}>
                          <img src={`https://github.com/${pessoa}.png`} />
                          <span>{pessoa}</span>
                        </a>
                      </li>
                    );
                  }
              )}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
