import { useCMS } from '../../contexts/cmsContext/useCMSContext'
import { MdxRenderer } from '../../../ImputRenderer'
import omit from 'lodash/omit'
import Frame from 'react-frame-component'

export const Preview = ({
  formValues,
  markdown,
}: {
  formValues: {
    [key: string]: any
  }
  markdown: string
}) => {
  const { currentCollection, currentFile, components } = useCMS()

  /**
   * Renders a custom MDX preview or just the plain markdown
   */
  const renderPreview = () => {
    return (
      <MdxRenderer
        descendants={formValues.body}
        components={currentCollection.preview?.components}
      />
    )
  }

  return (
    <Frame className="imp-flex-1">
      {currentCollection.preview?.header?.({
        ...omit(formValues, ['body']),
      })}
      {currentCollection.preview?.components ? (
        currentCollection.preview?.wrapper?.({
          children: renderPreview(),
        }) || renderPreview()
      ) : (
        <div className="imp-whitespace-break-spaces">{markdown}</div>
      )}
      {currentCollection.preview?.footer?.({
        ...omit(formValues, ['body']),
      })}
    </Frame>
  )
}
