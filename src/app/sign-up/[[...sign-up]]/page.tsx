import { SignUp } from '@clerk/nextjs'
import Container from "@/components/Container"

export default function Page() {
  return (
  <Container className="flex Justify-center">
    <SignUp />
  </Container>
  )

}