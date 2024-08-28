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
      <>
        {currentCollection.preview?.components ? (
          <MdxRenderer
            descendants={formValues.body}
            components={currentCollection.preview?.components}
          />
        ) : (
          <div className="imp-whitespace-break-spaces">{markdown}</div>
        )}
      </>
    )
  }

  return (
    <Frame className="imp-flex-1">
      {currentCollection.preview?.header?.({
        ...omit(formValues, ['body']),
      })}
      {currentCollection.preview?.wrapper?.({
        children: renderPreview(),
      }) || renderPreview()}
      {currentCollection.preview?.footer?.({
        ...omit(formValues, ['body']),
      })}
    </Frame>
  )
}
