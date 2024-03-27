'use client'

import NextCMS from './cms/routes'
import { BlockType, NextCMSContext } from './cms/contexts/cmsContext/context'
import { MdxProvider } from './ImputProvider'
import { MdxRenderer } from './ImputRenderer'
import './styles/output.css'

type NextCMSSettings = NextCMSContext['settings']

export default NextCMS
export { MdxProvider, MdxRenderer }
export type { BlockType, NextCMSSettings }
