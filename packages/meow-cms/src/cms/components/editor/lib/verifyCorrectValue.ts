import { BlockType } from 'src/cms/contexts/cmsContext/context'
import { MDXNode } from 'src/cms/types/mdxNode'

/**
 * Receives a component prop and verifies if its default value is what we expect
 * This is used in those cases where a component that expects an object (for exampe)
 * has been deserialized with a string instead
 */
export const verifyCorrectValue = (
  field: NonNullable<BlockType['fields']>[0],
  node: MDXNode
) => {
  console.log('------------------')
  console.log(`Checking prop ${field.name} for correct prop value`)
  console.log('field', field)
  console.log('node', node)

  console.log('')
  console.log('------------------')
}
