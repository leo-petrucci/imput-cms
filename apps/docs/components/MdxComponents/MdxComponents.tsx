import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle } from '@imput/components/Card'
import Link from 'next/link'
import { ArrowRight } from '@imput/components/Icon'
import React from 'react'

export const Components = {
  Note: ({ children }: any) => {
    return (
      <div className="imp-callout imp-mb-6 imp-overflow-x-auto imp-mt-6 imp-flex imp-rounded-lg imp-border imp-py-2 ltr:imp-pr-4 rtl:imp-pl-4 contrast-more:imp-border-current contrast-more:dark:imp-border-current imp-border-orange-100 imp-bg-orange-50 imp-text-orange-800 dark:imp-border-orange-400/30 dark:imp-bg-orange-400/20 dark:imp-text-orange-300">
        <div className="imp-select-none imp-text-xl imp-pl-3 imp-pr-2">💡</div>
        <div className="imp-w-full imp-min-w-0 imp-leading-7">{children}</div>
      </div>
    )
  },
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
}
