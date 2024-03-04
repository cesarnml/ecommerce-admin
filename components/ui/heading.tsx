import { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  children?: ReactNode
}

export const Heading = ({ title, description, children }: Props) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  )
}
