import Link from 'next/link'
import { Button } from '@imput/components/button'
import { Book, GithubLogo } from '@imput/components/Icon'

export const Navbar = () => {
  return (
    <div className="flex justify-center">
      <nav className="flex justify-between max-w-5xl w-full py-4">
        <Link href={`/`}>
          <img src={`/logo-with-text.svg`} />
        </Link>

        <ul className="flex flex-row gap-2">
          <li>
            <Button
              variant="ghost"
              onClick={() => {
                window.location.href = '/docs'
              }}
            >
              <Book className="w-5 h-5 mr-2" />
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
              <GithubLogo className="w-5 h-5 mr-2" />
              Github
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
