import { Button } from './button'
import { Textarea } from './textarea'

const MessageInput = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <Button variant='secondary'>Send</Button>
      <Textarea placeholder='Type your message here.' className='max-h-40' />
    </div>
  )
}

export default MessageInput
