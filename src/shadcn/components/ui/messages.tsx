import { cn } from '@shadcn/lib/utils'
import { ScrollArea } from './scroll-area'
import { Separator } from './separator'
import MessageLine from './message-line'
import { Accordion } from './accordion'
import moment, { Moment } from 'moment'

interface MessageListProps {
  messages: {
    content: string
    dateTime: Moment
    type: 'send' | 'receive'
  }[]
}

const MessageList = () =>
  //     {
  //   messages = [
  //     { content: 'hello', dateTime: Date.now(), type: 'send' },
  //     { content: 'hello back', dateTime: Date.now(), type: 'receive' }
  //   ]
  // }: MessageListProps
  {
    const messages = [
      {
        content:
          'hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello',
        dateTime: moment(),
        type: 'send'
      },
      { content: 'hello back', dateTime: moment(), type: 'receive' }
    ]
    return (
      <ScrollArea className='h-full w-full font-mono'>
        {messages.map((message, idx) => {
          return (
            <div key={idx} className='w-full flex flex-col'>
              <Accordion type='single' collapsible>
                <MessageLine
                  content={message.content}
                  placement={message.type === 'send' ? 'left' : 'right'}
                  time={message.dateTime}
                />
              </Accordion>
              {/* <MessageLine
                content={message.content}
                placement={message.type === 'send' ? 'left' : 'right'}
                time={message.dateTime}
              /> */}
              <Separator />
            </div>
          )
        })}
      </ScrollArea>
    )
  }

export default MessageList
