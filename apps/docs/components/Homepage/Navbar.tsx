import Link from 'next/link'
import { Button } from '@imput/components/Button'
import { Book, GithubLogo } from '@imput/components/Icon'

export const Navbar = () => {
  return (
    <div className="imp-flex imp-justify-center">
      <nav className="imp-flex imp-justify-between imp-max-w-5xl imp-w-full imp-py-4 imp-px-4 md:imp-px-0">
        <Link href={`/`}>
          <img src={`/logo-with-text.svg`} />
        </Link>

        <ul className="imp-flex imp-flex-row imp-gap-2">
          <li>
            <Button
              variant="ghost"
              onClick={() => {
                window.location.href = '/docs'
              }}
            >
              <Book className="imp-w-5 imp-h-5 imp-mr-2" />
              Docs
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => {
                window.location.href =
                  'https://github.com/leo-petrucci/imput-cms'
              }}
            >
              <GithubLogo className="imp-w-5 imp-h-5 imp-mr-2" />
              Github
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
