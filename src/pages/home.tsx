import { Nav } from '@shadcn/components/ui/nav'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@shadcn/components/ui/resizable'
import {
  Archive,
  ArchiveX,
  CatIcon,
  File,
  Inbox,
  Send,
  Trash2,
  UserCircle
} from 'lucide-react'
import { cn } from '@shadcn/lib/utils'
import { useState } from 'react'
import { WorkspaceSwitcher } from '@shadcn/components/ui/project-swichter'
import { Separator } from '@shadcn/components/ui/separator'
import MessageList from '@shadcn/components/ui/messages'
import MessageInput from '@shadcn/components/ui/message-input'
import { ScrollArea } from '@shadcn/components/ui/scroll-area'

interface HomeProps {
  defaultLayout: number[] | undefined
  naviBarDefaultCollapse: boolean
  naviBarCollapsedSize: number
}

const Home = () => {
  const {
    defaultLayout,
    naviBarDefaultCollapse,
    naviBarCollapsedSize
  }: HomeProps = {
    defaultLayout: [265, 440, 655],
    naviBarDefaultCollapse: false,
    naviBarCollapsedSize: 4
  }
  const [naviBarIsCollapsed, setNaviBarCollapse] = useState<boolean>(
    naviBarDefaultCollapse
  )

  return (
    <ResizablePanelGroup
      direction='horizontal'
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`
      }}
      className='h-full items-stretch'
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={naviBarCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => {
          setNaviBarCollapse(true)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`
        }}
        onExpand={() => {
          setNaviBarCollapse(false)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`
        }}
        className={cn(
          'flex flex-col',
          naviBarIsCollapsed &&
            'min-w-[50px] transition-all duration-300 ease-in-out'
        )}
      >
        <div
          className={cn(
            'flex h-[52px] items-center justify-center',
            naviBarIsCollapsed ? 'h-[52px]' : 'px-2'
          )}
        >
          <WorkspaceSwitcher
            isCollapsed={naviBarIsCollapsed}
            workspaces={[
              {
                label: 'workspace1',
                icon: <CatIcon />,
                color: 'red'
              }
            ]}
          />
        </div>
        <Separator />
        <ScrollArea className='h-full'>
          <Nav
            isCollapsed={naviBarIsCollapsed}
            links={[
              {
                title: 'Inbox',
                label: '128',
                icon: Inbox,
                variant: 'default'
              },
              {
                title: 'Drafts',
                label: '9',
                icon: File,
                variant: 'ghost'
              },
              {
                title: 'Sent',
                label: '',
                icon: Send,
                variant: 'ghost'
              },
              {
                title: 'Junk',
                label: '23',
                icon: ArchiveX,
                variant: 'ghost'
              },
              {
                title: 'Trash',
                label: '',
                icon: Trash2,
                variant: 'ghost'
              },
              {
                title: 'Archive',
                label: '',
                icon: Archive,
                variant: 'ghost'
              }
            ]}
          />
        </ScrollArea>
        <Separator />
        <div className='bottom-2'>
          <Nav
            isCollapsed={naviBarIsCollapsed}
            links={[
              {
                title: 'username',
                label: 'user',
                icon: UserCircle,
                variant: 'default'
              }
            ]}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        className='p-2 flex flex-col'
      >
        <MessageList />
        <MessageInput />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]}>
        <div>this is config panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Home
