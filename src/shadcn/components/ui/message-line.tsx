import { cn } from '@shadcn/lib/utils'
import { Button } from './button'
import { Copy, CopyCheck, HdmiPort, Laptop } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { useState } from 'react'
import { Badge } from './badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './accordion'

interface MessageLineProps {
  content: string
  placement: 'left' | 'right'
}

const MessageLine = ({ content, placement }: MessageLineProps) => {
  const [copied, setCopied] = useState(false)

  const onCopyMessage = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }
  return (
    // <AccordionItem value={content}>
    //   <AccordionTrigger>{content}</AccordionTrigger>
    //   <AccordionContent>{content}</AccordionContent>
    // </AccordionItem>
    <div
      className={cn(
        'w-full flex gap-1 justify-between py-2',
        placement === 'left' ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'w-full flex gap-1',
          placement === 'left' ? 'flex-row' : 'flex-row-reverse'
        )}
      >
        <Avatar>
          <AvatarFallback>
            {placement === 'left' ? <HdmiPort /> : <Laptop />}
          </AvatarFallback>
        </Avatar>
        <Badge
          variant={placement === 'left' ? 'secondary' : 'outline'}
          className={cn(
            'max-w-[3/4] flex flex-row self-center text-lg p-2',
            placement === 'left' ? 'justify-start' : 'justify-end'
          )}
        >
          {content}
        </Badge>
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='p-0'
        onClick={onCopyMessage}
      >
        {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
      </Button>
    </div>
  )
}

export default MessageLine
