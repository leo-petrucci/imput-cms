import Image from '../../image/image'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'
import { CollectionType } from '../../../types/collection'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@imput/components/Card'
import { Skeleton } from '@imput/components/Skeleton'
import React, { useMemo, useState } from 'react'
import {
  CircleNotch,
  DotsThreeOutlineVertical,
  Pencil,
  Trash,
} from '@imput/components/Icon'
import { Button } from '@imput/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDialogItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@imput/components/DropdownMenu'
import { useDeleteFile, useRenameFile } from '../../../queries/github'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@imput/components/Dialog'
import Form from '@imput/components/form'
import { Input as ControlledInput } from '@imput/components/Input/Controlled'
import { useForm } from 'react-hook-form'
import path from 'path'
import { Separator } from '@imput/components/Separator'
import { P } from '@imput/components/Typography'

export interface CollectionCardProps extends CollectionType {
  baseUrl: string
}

/**
 * Render a clickable content card
 */
export const CollectionCard = (props: CollectionCardProps) => {
  const [openMenu, setOpenMenu] = useState(false)

  const { currentCollection } = useCMS()

  const { mutate: deleteMutation } = useDeleteFile(
    currentCollection.folder,
    props.filename || ''
  )

  // find the first string field in config
  const firstStringField = currentCollection.fields.find(
    (f) => f.widget === 'string'
  )

  // title is first string field
  // falls back to file slug if not defined
  const title = firstStringField
    ? props.data[firstStringField.name]
    : props.slug

  // find the first image field in config, then use its name to find the image in the props
  const firstImageField = currentCollection.fields.find(
    (f) => f.widget === 'image'
  )
  const image = firstImageField ? props.data[firstImageField.name] : undefined

  return (
    <div className="imp-relative">
      <Link
        key={props.slug}
        to={`${props.baseUrl}/${props.slug}`}
        className="imp-flex"
      >
        <Card className="imp-relative hover:imp-bg-primary-foreground imp-transition-colors hover:imp-text-accent-foreground imp-overflow-hidden imp-flex-1 imp-flex imp-flex-col imp-justify-end">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {image && <Image path={image} />}
          <CardHeader className="imp-self-start">{title}</CardHeader>
        </Card>
      </Link>
      {/* The card has a dropdown menu with actions. We keep it outside the card to avoid clicks bubbling up and triggering a click to the link */}
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button
            className="imp-absolute imp-right-2 imp-top-2 imp-bg-primary/75 hover:imp-bg-primary imp-p-2"
            variant="ghost"
            size="icon"
          >
            <DotsThreeOutlineVertical className="imp-w-4 imp-h-4 imp-text-primary-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Content</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <EditDialog defaultValue={props.filename || ''} />
            <DeleteDialog filename={props.filename || ''} title={title} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const CollectionCardSkeleton = () => {
  const { currentCollection } = useCMS()

  // if collection doesn't have images we don't bother showing a skeleton
  const firstImageField = currentCollection.fields.find(
    (f) => f.widget === 'image'
  )

  return (
    <Card className="hover:imp-bg-primary-foreground imp-transition-colors hover:imp-text-accent-foreground imp-overflow-hidden">
      {firstImageField && <Skeleton className="imp-w-full imp-h-48" />}
      <CardHeader>
        <Skeleton className="imp-w-full imp-h-6" />
      </CardHeader>
    </Card>
  )
}

/**
 * A menu item that opens a dialog to edit its identifier
 */
const EditDialog = ({ defaultValue }: { defaultValue: string }) => {
  const [open, setOpen] = React.useState(false)
  const { currentCollection } = useCMS()
  const { mutate, isLoading } = useRenameFile(
    path.join(currentCollection.folder, defaultValue)
  )

  const close = () => {
    setOpen(false)
  }

  const { filename, extension } = useMemo(() => {
    return {
      extension: defaultValue.split('.').pop(),
      filename: defaultValue.split('.')[0],
    }
  }, [])

  const form = useForm({
    defaultValues: {
      filename,
    },
  })

  return (
    <Dialog
      onOpenChange={(event) => {
        setOpen(event)
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Pencil className="imp-mr-2 imp-h-4 imp-w-4" />
          <span>Edit identifier</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        className="!imp-p-0 imp-flex imp-flex-col !imp-gap-2"
        onCloseClick={(e) => {
          close()
        }}
      >
        <DialogHeader className="imp-px-2 imp-pt-4 imp-pb-2">
          <DialogTitle>Edit content identifier</DialogTitle>
        </DialogHeader>
        <Separator orientation="horizontal" />
        <div className="imp-p-2">
          <Form
            onSubmit={async ({ filename }) => {
              const id = toast.loading(`Updating identifier...`)
              mutate(
                path.join(currentCollection.folder, `${filename}.${extension}`),
                {
                  onSuccess: () => {
                    close()
                    toast.success(`Identifier updated!`, {
                      id,
                    })
                  },
                  onError: () => {
                    toast.error(`Something went wrong`, {
                      id,
                    })
                  },
                }
              )
            }}
            form={form}
          >
            <div className="imp-flex imp-flex-col imp-gap-2">
              <Form.Item
                label="Filename"
                name="filename"
                description={
                  <>
                    Your identifier is a unique id that is generated when your
                    content is created. It's essentially your content's
                    filename. You would usually use this to point at this
                    specific piece of content.
                  </>
                }
              >
                <ControlledInput endAdornment={`.${extension}`} />
              </Form.Item>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <CircleNotch className="imp-w-4 imp-h-4 imp-mr-2 imp-animate-spin" />
                )}
                Save
              </Button>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * A menu item that opens a dialog to delete the content
 */
const DeleteDialog = ({
  filename,
  title,
}: {
  filename: string
  title: string
}) => {
  const [open, setOpen] = React.useState(false)
  const { currentCollection } = useCMS()

  const { mutate } = useDeleteFile(currentCollection.folder, filename)
  const close = () => {
    setOpen(false)
  }

  return (
    <Dialog
      onOpenChange={(event) => {
        setOpen(event)
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="imp-text-destructive hover:!imp-bg-destructive hover:!imp-text-primary-foreground"
          onClick={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Trash className="imp-mr-2 imp-h-4 imp-w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        className="!imp-p-0 imp-flex imp-flex-col !imp-gap-2"
        onCloseClick={(e) => {
          close()
        }}
      >
        <DialogHeader className="imp-px-2 imp-pt-4 imp-pb-2">
          <DialogTitle>Delete {title}?</DialogTitle>
        </DialogHeader>
        <Separator orientation="horizontal" />
        <div className="imp-p-2">
          <P asChild>
            <span>
              Are you sure you want to delete this content? You won't be able to
              recover it from the Imput interface, although it might still exist
              in your git provider's history.
            </span>
          </P>
        </div>
        <Separator orientation="horizontal" />
        <div className="imp-p-2 imp-flex imp-justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              const id = toast.loading(`Deleting ${title}...`)
              mutate(undefined, {
                onSuccess: () => {
                  close()
                  toast.success(`${title} was deleted!`, {
                    id,
                  })
                },
                onError: () => {
                  toast.error(`Something went wrong`, {
                    id,
                  })
                },
              })
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
