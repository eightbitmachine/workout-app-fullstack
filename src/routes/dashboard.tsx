import { createFileRoute } from '@tanstack/react-router'
// import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '../dashboard/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  // beforeLoad(ctx) {
  //   if (!ctx.user) {
  //     throw redirect({ to: "/login" })
  //   }
  // },
})

function RouteComponent() {
  return <Dashboard />
}
