type LoginFormProps = {
  errors: { [name: string]: string[] } | []
  email: string
}

// Parse, don't validate
const LoginForm = ({ email, errors }: LoginFormProps) => (
  <form action="">
    <div><label htmlFor="email"></label><input id="email" name="email" type="email" /></div>
    <div>
      <label htmlFor="password"></label>
      <text id="password" name="password" type="password"></text>
    </div>
    <div><button>Login</button></div>
  </form>
)

export { LoginForm }
