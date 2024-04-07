import { Card, CardHeader } from '@imput/components/Card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@imput/components/Dropdown'
import Image from '../../image'
import { DotsThreeVertical, Trash } from '@imput/components/Icon'
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@imput/components/Alert'
import { useDeleteFileFromGithub } from '../../../queries/github'
import { Skeleton } from '@imput/components/Skeleton'

export type ImageCardProps = {
  path: string
}

/**
 * Renders a card to display an Imput file. Includes dropdown option to delete the file.
 */
export const FileCard = (props: ImageCardProps) => {
  const { mutate } = useDeleteFileFromGithub(props.path)
  return (
    <>
      <Card className="relative hover:bg-primary-foreground transition-colors hover:text-accent-foreground overflow-hidden cursor-pointer">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 right-2 bg-card hover:bg-primary-foreground p-2 rounded">
              <DotsThreeVertical size={24} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => {
                    console.log('delete image')
                    // check here if image is used anywhere with the github api
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete image</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone via Imput. You may be able to
                recover the file from Github.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogCancel>Cancel</DialogCancel>
              <DialogAction
                onClick={async () => {
                  await mutate()
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete file
              </DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Image path={props.path} />
        <CardHeader>{props.path}</CardHeader>
      </Card>
    </>
  )
}

export const FileCardSkeleton = () => {
  return (
    <Card className="hover:bg-primary-foreground transition-colors hover:text-accent-foreground overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader>
        <Skeleton className="w-full h-6" />
      </CardHeader>
    </Card>
  )
}
