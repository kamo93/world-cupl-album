import { Block, Button } from "react-bulma-components";
import { useSupabaseContext } from "../../Contexts/SupabaseContext"

function Login() {
  const { supabase } = useSupabaseContext();

  async function openGmailOauth() {
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
      if (res.error) {
        throw Error('signInWithOAuth error - ' + res.error.name)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <Block>
      <Button onClick={() => { openGmailOauth() }} >Gmail</Button>
    </Block>
  )

}

export default Login;
