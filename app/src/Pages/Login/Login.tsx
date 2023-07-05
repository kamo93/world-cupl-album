import { Block, Button, Heading } from 'react-bulma-components'
import { useSupabaseContext } from '../../Contexts/SupabaseContext'
import styled from 'styled-components'
import GoogleLogo from '../../Components/GoogleLogo/GoogleLogo'

const StyledContainer = styled(Block)`
  flex-wrap: nowrap;
  display: flex;
  height: 100%;
  min-height: 100%;
`

const StyledContainerTitle = styled(Block)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  flex-direction: column;
`

const StyledContainerButton = styled(Block)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const StyledGoogleLogo = styled.div`
  display: flex;
  flex: 1;
`

const StyledButtonText = styled.span`
  display: flex;
  justify-content: center;
  flex: 13;
`

const StyledTitle = styled(Heading)`
  display: flex;
  justify-content: center;
  text-align: center;
`

function Login (): JSX.Element {
  const { supabase } = useSupabaseContext()

  async function openGmailOauth (): Promise<void> {
    try {
      const res = await supabase.auth.signInWithOAuth(
        {
          provider: 'google',
          options: {
            scopes: 'email profile',
            redirectTo: 'http://localhost:5173'
          }
        }
      )
      if (res.error != null) {
        throw Error('signInWithOAuth error - ' + res.error.name)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <StyledContainer flexDirection='column' mx={3}>
      <StyledContainerTitle marginless>
        <StyledTitle justifyContent='center'>Album Panini</StyledTitle>
        <StyledTitle subtitle justifyContent='center'>Completa el album solo o con algun amigo.</StyledTitle>
      </StyledContainerTitle>
      <StyledContainerButton marginless>
        <Button fullwidth onClick={() => { openGmailOauth() as void }}>
          <StyledGoogleLogo>
            <GoogleLogo />
          </StyledGoogleLogo>
          <StyledButtonText>
            Continuar con Google
          </StyledButtonText>
        </Button>
      </StyledContainerButton>
    </StyledContainer>
  )
}

export default Login
