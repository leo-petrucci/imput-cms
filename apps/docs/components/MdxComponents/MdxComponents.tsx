import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle } from '@imput/components/Card'
import Link from 'next/link'
import { ArrowRight } from '@imput/components/Icon'
import React from 'react'
import { cn } from '@imput/components/lib/utils'

export const Components = {
  Note: ({ children }: any) => {
    return (
      <div className="imp-callout imp-mb-6 imp-overflow-x-auto imp-mt-6 imp-flex imp-rounded-lg imp-border imp-py-2 ltr:imp-pr-4 rtl:imp-pl-4 contrast-more:imp-border-current contrast-more:dark:imp-border-current imp-border-orange-100 imp-bg-orange-50 imp-text-orange-800 dark:imp-border-orange-400/30 dark:imp-bg-orange-400/20 dark:imp-text-orange-300">
        <div className="imp-select-none imp-text-xl imp-pl-3 imp-pr-2">💡</div>
        <div className="imp-w-full imp-min-w-0 imp-leading-7">{children}</div>
      </div>
    )
  },
  code: dynamic(() =>
    import('../Code').then((module) => ({
      default: module.Code,
    }))
  ),
  pre: dynamic(() =>
    import('../Pre').then((module) => ({
      default: module.Pre,
    }))
  ),
  PropsTable: dynamic(() => import('../PropsTable')),
  Video: ({ src }: any) => {
    return <video controls src={src}></video>
  },
  TabsRoot: dynamic(() =>
    import('@imput/components/tabs').then((module) => ({
      default: module.Tabs,
    }))
  ),
  TabsContent: dynamic(() =>
    import('@imput/components/tabs').then((module) => ({
      default: module.Content,
    }))
  ),
  ContentLink: ({ title, href }: { title: string; href: string }) => (
    <Link href={href} className="imp-mt-4 imp-block">
      <Card className="imp-group hover:imp-bg-accent imp-transition-colors">
        <CardHeader className="imp-flex imp-gap-2 imp-items-center imp-flex-row imp-relative">
          <CardTitle className="!imp-mt-0">{title}</CardTitle>
          <ArrowRight
            size={24}
            weight="bold"
            className="imp-text-primary/20 imp-absolute imp-right-8 group-hover:imp-text-primary group-hover:imp-translate-x-2 imp-transition-all"
          />
        </CardHeader>
      </Card>
    </Link>
  ),
  Header: dynamic(() =>
    import('../Homepage/Header').then((module) => ({ default: module.Header }))
  ),
  VideoHeading: dynamic(() =>
    import('../Homepage/VideoHeading').then((module) => ({
      default: module.VideoHeading,
    }))
  ),
  Navbar: dynamic(() =>
    import('../Homepage/Navbar').then((module) => ({ default: module.Navbar }))
  ),
  ImageTextSection: dynamic(() =>
    import('../Homepage/ImageTextSection').then((module) => ({
      default: module.ImageTextSection,
    }))
  ),
  Footer: dynamic(() =>
    import('../Homepage/Footer').then((module) => ({ default: module.Footer }))
  ),
  h1: (props: any) => (
    <h1
      className="imp-mt-2 imp-text-4xl imp-font-bold imp-tracking-tight imp-text-slate-900 dark:imp-text-slate-100"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="imp-mt-10 imp-border-b imp-pb-1 imp-text-3xl imp-border-neutral-200/70 contrast-more:imp-border-neutral-400 dark:imp-border-primary-100/10 contrast-more:dark:imp-border-neutral-400"
      {...props}
    />
  ),
  h3: (props: any) => <h3 className="imp-mt-8 imp-text-2xl" {...props} />,
  h4: (props: any) => <h4 className="imp-mt-8 imp-text-xl" {...props} />,
  h5: (props: any) => <h5 className="imp-mt-8 imp-text-lg" {...props} />,
  h6: (props: any) => <h6 className="imp-mt-8 imp-text-base" {...props} />,
  ul: (props: any) => (
    <ul
      className="imp-mt-6 imp-list-disc first:imp-mt-0 ltr:imp-ml-6 rtl:imp-mr-6"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="imp-mt-6 imp-list-decimal first:imp-mt-0 ltr:imp-ml-6 rtl:imp-mr-6"
      {...props}
    />
  ),
  li: (props: any) => <li className="imp-my-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className={cn(
        'imp-mt-6 imp-border-gray-300 imp-italic imp-text-gray-700 dark:imp-border-gray-700 dark:imp-text-gray-400',
        'first:imp-mt-0 ltr:imp-border-l-2 ltr:imp-pl-6 rtl:imp-border-r-2 rtl:imp-pr-6'
      )}
      {...props}
    />
  ),
  hr: (props: any) => (
    <hr
      className="imp-my-8 imp-border-neutral-200/70 contrast-more:imp-border-neutral-400 dark:imp-border-primary-100/10 contrast-more:dark:imp-border-neutral-400"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      {...props}
      className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
    />
  ),
  p: (props: any) => (
    <p className="imp-mt-6 imp-leading-7 first:imp-mt-0" {...props} />
  ),
}
