import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '../login/LoginForm'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <div>Hello "/login"!</div>
    <LoginForm email="" errors={[]} />
  </div>
}
