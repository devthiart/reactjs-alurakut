import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `;

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

export default function Home() {
  const githubUser = 'devthiart';
  const [comunidades, setComunidades] = React.useState([{
    id: '145154145145154514',
    title: 'Eu odeio acordar cedo',
    image: 'https://img10.orkut.br.com/community/52cc4290facd7fa700b897d8a1dc80aa.jpg'
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
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map(
                  (comunidade, index) => {
                    return (
                      <li hidden={index>=6} key={comunidade.id}>
                        <a href={`/users/${comunidade.title}`} key={comunidade.title}>
                          {/* <img src={`https://github.com/${comunidade}.png`} /> */}
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
              {pessoasFavoritas.map(
                  (pessoa, index) => {
                    return (
                      <li hidden={index>=6} key={pessoa}>
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
