import Link from 'next/link'

export const NavBar = () => {
  return (
    <nav className="flex justify-between">
      <Link href={`/`}>
        <img src={`/logo-with-text.svg`} />
      </Link>
    </nav>
  )
}
