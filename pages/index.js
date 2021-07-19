import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
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

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros', 
    'omariosouto', 
    'rafaelrcapuano',
    'filipedeschamps',
    'peas', 
    'rafaballerini', 
    'marcobrunodev', 
    'felipefialho'
  ];
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
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
    });

    // Utilizando API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': `d1fc6113ab963ea2079e98bfab2cd1`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        'query': `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }` 
      }),
    })
    .then(response => response.json())
    .then(completeResponse => {
      setComunidades(completeResponse.data.allCommunities);
    });
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

              console.log('title: ', dadosDoForm.get('title'));
              console.log('image: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser, 
              }

              //Executa o código do nosso BFF que está em './api/comunidades.js'
              fetch('/api/comunidades', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                
                console.log(dados.registroCriado);

                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              });

              if(comunidade.imageUrl == "") {
                comunidade.imageUrl = 'https://placehold.it/300x300';
              }
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
                  (itemAtual) => {
                    return (
                      <li key={itemAtual.id}>
                        <a href={`/communities/${itemAtual.id}`} key={itemAtual.title}>
                          <img src={itemAtual.imageUrl} />
                          <span>{itemAtual.title}</span>
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json());
  
  console.log('isAuthenticated', isAuthenticated);

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  // const githubUser = jwt.decode(token).githubUser;
  const { githubUser } = jwt.decode(token);
  
  return {
    // props: {
    //   githubUser: githubUser
    // },
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}