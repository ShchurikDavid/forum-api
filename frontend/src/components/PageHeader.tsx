type PageHeaderProps = {
  title: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="page-eyebrow">Нотатки розробників</p>
      <h1>{title}</h1>
      <p>Ідеї та практичні поради про frontend і backend.</p>
    </header>
  )
}
