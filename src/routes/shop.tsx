import { createFileRoute, Link } from '@tanstack/react-router'
import { Heading } from 'react-aria-components'
import { Button } from '../components/Button'

import { ArrowIcon } from '../components/ArrowIcon'

export const Route = createFileRoute('/shop')({
  component: ShopPage,
})

function ShopPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <Link to="/">
        <Button variant="outline">
          <ArrowIcon direction="left" />
          BACK
        </Button>
      </Link>
      <Heading level={1}>Shop</Heading>
      <p>Buy colors and upgrades here!</p>
    </main>
  )
}
