import { createFileRoute } from "@tanstack/react-router";

import '../index.css'
import App from '../App.tsx'

export const Index = () => {
  return <App />
}

export const Route = createFileRoute('/')({ component: Index })
