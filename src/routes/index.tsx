import { createFileRoute, Link } from '@tanstack/react-router'
import { Heading } from 'react-aria-components'
import { Button } from '../components/Button'


export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main style={{ 
      padding: '4rem 2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Heading level={1} style={{ fontSize: '4rem', marginBottom: '4rem', letterSpacing: '-0.03em' }}>Color Mixing Game</Heading>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/battle" search={{ level: undefined }}>
          <Button style={{ width: '100%', padding: '1.5rem', fontSize: '1.5rem' }}>CONTINUE</Button>
        </Link>
        <Link to="/levels" search={{}}>
          <Button style={{ width: '100%', padding: '1.5rem', fontSize: '1.5rem' }}>LEVELS</Button>
        </Link>
        <Link to="/shop" search={{}}>
          <Button style={{ width: '100%', padding: '1.5rem', fontSize: '1.5rem' }}>SHOP</Button>
        </Link>
      </nav>
    </main>
  )
}
