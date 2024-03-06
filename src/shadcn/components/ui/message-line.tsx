import { cn } from '@shadcn/lib/utils'
import { Button } from './button'
import {
  ArrowDown01,
  ArrowUp01,
  Copy,
  CopyCheck,
  HdmiPort,
  Laptop
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'
import { useState } from 'react'
import { Badge } from './badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './accordion'
import { Moment } from 'moment'
import { Separator } from './separator'

interface MessageLineProps {
  content: string
  placement: 'left' | 'right'
  time: Moment
}

const MessageLine = ({ content, placement, time }: MessageLineProps) => {
  const [copied, setCopied] = useState(false)

  const onCopyMessage = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }
  const alignLeft = placement === 'left'
  return (
    <AccordionItem value={content}>
      <AccordionTrigger
        className={cn(
          'gap-2 flex',
          alignLeft ? 'flex-row' : 'flex-row-reverse'
        )}
      >
        <Badge variant='secondary' className='min-w-fit text-neutral-500 gap-2'>
          {alignLeft ? <ArrowDown01 size={14} /> : <ArrowUp01 size={14} />}
          {time.calendar()}
        </Badge>
        <span className='w-full line-clamp-1 text-start'>{content}</span>
      </AccordionTrigger>
      <AccordionContent className='bg-neutral-100 rounded-lg px-2 gap-1 flex flex-col'>
        <div className='flex flex-row align-middle h-fit'>
          <Button
            variant='ghost'
            size='icon'
            className='p-0'
            onClick={onCopyMessage}
          >
            {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
          </Button>
        </div>
        <Separator />
        <span className='break-all'>{content.hexEncode()}</span>
      </AccordionContent>
    </AccordionItem>
  )
}

export default MessageLine
