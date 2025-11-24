import { Button as AriaButton } from 'react-aria-components'
import { CSSProperties, ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<typeof AriaButton> {
  variant?: 'primary' | 'outline' | 'ghost'
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const styles: Record<string, CSSProperties> = {
    primary: {
      border: '2px solid #000',
      background: '#000',
      color: '#fff',
    },
    outline: {
      border: '2px solid #000',
      background: 'transparent',
      color: '#000',
    },
    ghost: {
      border: '2px solid transparent',
      background: 'transparent',
      color: '#000',
    },
  }

  return (
    <AriaButton
      style={{
        ...styles[variant],
        padding: '0.6em 1.2em',
        fontSize: '1em',
        fontFamily: 'inherit',
        cursor: props.isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        textTransform: 'uppercase',
        fontWeight: 500,
        letterSpacing: '0.05em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5em',
        opacity: props.isDisabled ? 0.3 : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </AriaButton>
  )
}
