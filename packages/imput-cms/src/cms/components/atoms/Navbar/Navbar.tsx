import { Separator } from '@imput/components/Separator'
import { RemainingRequests } from '../../molecules/RemainingRequests'
import { Muted } from '@imput/components/Typography'
import pkg from '../../../../../package.json'

export type NavbarProps = {
  leftSlot: JSX.Element
  rightSlot: JSX.Element
}

/**
 * Reusable navbar component. Includes Imput version and requests remaining
 */
export const Navbar = ({ leftSlot, rightSlot }: NavbarProps) => (
  <div className="imp-flex imp-flex-1 imp-justify-between imp-items-center">
    {leftSlot}
    <div className="imp-self-end imp-flex imp-gap-2 imp-items-center imp-h-full">
      <Muted className="imp-font-mono imp-text-gray imp-text-xs">
        {pkg.version}
      </Muted>
      <Separator orientation="vertical" />
      <RemainingRequests />
      <Separator orientation="vertical" />
      {rightSlot}
    </div>
  </div>
)
