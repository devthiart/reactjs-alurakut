import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

// const Title = styled.h1`
//   font-size: 50px;
//   color: ${({ theme }) => theme.colors.primary};
// `;

function ProfileSidebar(props) {
  console.log(props);
  return (
    <Box>
      <img src={ `https://www.github.com/${props.githubUser}.png` } style={{ borderRadius: '8px' }}/>
      <h3>{props.githubUser}</h3>
    </Box>
  )
}

export default function Home() {
  const githubUser = 'devthiart';
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
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1>Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>  
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.map(
                  (pessoa, index) => {
                    console.log(pessoa);
                    return (
                      <li hidden={index>=6} key={index}>
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
          <Box>
            Comunidades
          </Box>
        </div>
      </MainGrid>
    </>
  );
}
