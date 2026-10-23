import { RedirectIfAuthed } from '@/components/layout/guards'
import { Login } from '@/views/Login'

export default function LoginPage() {
  return (
    <RedirectIfAuthed>
      <Login />
    </RedirectIfAuthed>
  )
}
