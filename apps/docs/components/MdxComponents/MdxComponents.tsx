import PropsTable from '../PropsTable'
import Tabs from '@imput/components/tabs'

export const Components = {
  Note: ({ children }: any) => {
    return (
      <div className="callout mb-6 overflow-x-auto mt-6 flex rounded-lg border py-2 ltr:pr-4 rtl:pl-4 contrast-more:border-current contrast-more:dark:border-current border-orange-100 bg-orange-50 text-orange-800 dark:border-orange-400/30 dark:bg-orange-400/20 dark:text-orange-300">
        <div className="select-none text-xl pl-3 pr-2">💡</div>
        <div className="w-full min-w-0 leading-7">{children}</div>
      </div>
    )
  },
  PropsTable,
  Video: ({ src }: any) => {
    return <video controls src={src}></video>
  },
  TabsRoot: Tabs,
  TabsContent: Tabs.Content,
  ContentLink: () => <></>,
}
