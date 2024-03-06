import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './accordion'
import { Badge } from './badge'
import { cn } from '@shadcn/lib/utils'
import { Checkbox } from './checkbox'
import { useDeviceListStore } from '@/device/use-devicelist'
import { useToast } from './use-toast'

/*~ https://wicg.github.io/serial/#dom-paritytype */
type ParityType = 'none' | 'even' | 'odd'

/*~ https://wicg.github.io/serial/#dom-flowcontroltype */
type FlowControlType = 'none' | 'hardware'

/*~ https://wicg.github.io/serial/#dom-serialoptions */
interface SerialOptions {
  baudRate: number
  dataBits?: number | undefined
  stopBits?: number | undefined
  parity?: ParityType | undefined
  bufferSize?: number | undefined
  flowControl?: FlowControlType | undefined
}

interface SerialPortIdentifier {
  usbProductId: string
  usbVendorId: string
}
// import { SerialPort } from 'serialport'
const MessageInput = () => {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const baudRateOptions = [
    300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880, 115200, 230400,
    250000
  ]
  const dataBitOptions = [5, 6, 7, 8]
  const stopBitOptions = [1, 1.5, 2]
  const parityBitOptions = ['none', 'even', 'odd']
  const flowControlOptions = ['none', 'hardware']

  const labelClasses = cn('self-center w-[110px]')
  const optionRowClasses = cn('flex flex-row gap-2 w-full')
  const selectClasses = cn('min-w-[180px] max-w-full')

  const deviceList = useDeviceListStore()

  const [serialArgs, setSerialArgs] = useState<SerialOptions>({
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none'
  })
  //   const [selectedPortId, setSelectedPortId] = useState<SerialPortIdentifier>()
  const [serialPort, setSerialPort] = useState<SerialPort>()
  type SerialConnectState = 'disconnected' | 'connecting' | 'connected'
  const [connectState, setConnectState] =
    useState<SerialConnectState>('disconnected')

  const [keepReading, setKeepReading] = useState(true)
  const keepReadingRef = useRef(keepReading)
  useEffect(() => {
    keepReadingRef.current = keepReading
  }, [keepReading])
  const [reader, setReader] = useState<ReadableStreamDefaultReader>()

  async function readFromSerial() {
    while (serialPort.readable && keepReadingRef.current) {
      const sReader = serialPort.readable.getReader()
      setReader(sReader)
      try {
        while (keepReading) {
          const { value, done } = await sReader.read()
          if (done) {
            break
          }
          // value is a Uint8Array.
          console.log(value)
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error
        })
      } finally {
        // Allow the serial port to be closed later.
        sReader.releaseLock()
      }
    }
    setConnectState('disconnected')
    toast({
      variant: 'default',
      title: 'Success',
      description: 'Disconnected'
    })
    await serialPort.close()
    setKeepReading(true)
  }

  const writeToSerial = async (data: Uint8Array) => {
    if (!serialPort || !serialPort.writable) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Open a port before write data'
      })
      return
    }
    const writer = serialPort.writable.getWriter()

    await writer.write(data)
    console.log('write done')
    // Allow the serial port to be closed later.
    writer.releaseLock()
  }

  const handleConnectSerial = () => {
    if (!serialPort) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No port selected'
      })
    } else {
      serialPort
        .open(serialArgs)
        .then(async () => {
          setConnectState('connected')
          toast({
            variant: 'default',
            title: 'Success',
            description: 'Connect succeed'
          })
          readFromSerial()
        })
        .catch(() => {
          toast({
            variant: 'destructive',
            title: 'Fail',
            description: 'Connect failed'
          })
        })
    }
  }
  const handleDisconnectSerial = () => {
    setKeepReading(false)
    reader?.cancel()
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <Accordion type='multiple'>
        <AccordionItem value='connection-config gap-2'>
          <AccordionTrigger
            className='bg-secondary flex-row-reverse rounded-lg px-2 h-min py-1'
            onClick={() => {
              //   navigator.serial.requestPort()
            }}
          >
            <div className='w-full flex justify-between'>
              <Badge variant='outline'>Connection Config</Badge>
              <Button
                disabled={!serialPort || connectState === 'connecting'}
                size='sm'
                className='w-min'
                onClick={(e) => {
                  e.stopPropagation()
                  //   console.log('selected port: ', serialPort)
                  //   console.log('selected args: ', serialArgs)
                  if (connectState === 'connected') {
                    console.log('disc')
                    handleDisconnectSerial()
                  } else {
                    handleConnectSerial()
                  }
                }}
              >
                {connectState === 'connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className='px-2 h-min py-1 '>
            <div className='flex flex-col gap-2'>
              <div className={optionRowClasses}>
                <label htmlFor='port' className={labelClasses}>
                  Port
                </label>
                <Button
                  disabled={
                    connectState === 'connected' ||
                    connectState === 'connecting'
                  }
                  className={selectClasses}
                  onClick={async () => {
                    const port = await navigator.serial.requestPort()
                    setSerialPort(port)
                  }}
                >
                  Select Port
                </Button>
                {/* <Select
                  onValueChange={(v) => {
                    console.log(v)

                    const selectedDevice: Electron.SerialPort = deviceList.find(
                      (d) => d.portId === v
                    )
                    setSelectedPortId({
                      usbProductId: selectedDevice.productId,
                      usbVendorId: selectedDevice.vendorId
                    })
                  }}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue placeholder='Select a port' />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceList.map((v) => (
                      <SelectItem value={v.portId} key={v.portId}>
                        {`${v.portName}(${v.displayName})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
              <div className={optionRowClasses}>
                <label htmlFor='baudrate' className={labelClasses}>
                  Baud Rate
                </label>
                <Select
                  onValueChange={(value) => {
                    setSerialArgs((prev) => ({
                      ...prev,
                      baudRate: Number(value)
                    }))
                  }}
                  defaultValue={serialArgs.baudRate.toString()}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue
                      id='baudrate'
                      placeholder='Select a baud rate'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {baudRateOptions.map((rate) => (
                      <SelectItem value={rate.toString()} key={rate}>
                        {rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={optionRowClasses}>
                <label htmlFor='databit' className={labelClasses}>
                  Data Bit
                </label>
                <Select
                  onValueChange={(value) => {
                    setSerialArgs((prev) => ({
                      ...prev,
                      dataBits: Number(value)
                    }))
                  }}
                  defaultValue={serialArgs.dataBits.toString()}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue id='databit' placeholder='Select a data bit' />
                  </SelectTrigger>
                  <SelectContent>
                    {dataBitOptions.map((b) => (
                      <SelectItem value={b.toString()} key={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={optionRowClasses}>
                <label htmlFor='stopbit' className={labelClasses}>
                  Stop Bit
                </label>
                <Select
                  onValueChange={(value) => {
                    setSerialArgs((prev) => ({
                      ...prev,
                      stopBits: Number(value)
                    }))
                  }}
                  defaultValue={serialArgs.stopBits.toString()}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue id='stopbit' placeholder='Select a stop bit' />
                  </SelectTrigger>
                  <SelectContent>
                    {stopBitOptions.map((b) => (
                      <SelectItem value={b.toString()} key={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={optionRowClasses}>
                <label htmlFor='paritycheck' className={labelClasses}>
                  Parity Check
                </label>
                <Select
                  onValueChange={(value) => {
                    setSerialArgs((prev) => ({
                      ...prev,
                      parity: value as ParityType
                    }))
                  }}
                  defaultValue={serialArgs.parity}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue
                      id='paritycheck'
                      placeholder='Select parity check'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parityBitOptions.map((p) => (
                      <SelectItem value={p} key={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={optionRowClasses}>
                <label className={labelClasses}>Flow Control</label>
                <Select
                  onValueChange={(value) => {
                    setSerialArgs((prev) => ({
                      ...prev,
                      flowControl: value as FlowControlType
                    }))
                  }}
                  defaultValue={serialArgs.flowControl}
                >
                  <SelectTrigger className={selectClasses}>
                    <SelectValue placeholder='Select flow control type' />
                  </SelectTrigger>
                  <SelectContent>
                    {flowControlOptions.map((f) => (
                      <SelectItem value={f} key={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={optionRowClasses}>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='dtr' />
                  <label
                    htmlFor='dtr'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    DTR
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='rts' />
                  <label
                    htmlFor='rts'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    RTS
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Textarea
        onChange={(e) => {
          setMessage(e.target.value)
        }}
        placeholder='Type your message here.'
        className='max-h-40'
      />
      <div className='flex flex-row justify-between'>
        <span className='px-2 text-sm text-neutral-500'>{`${new TextEncoder().encode(message).length} bytes`}</span>
        <Button
          variant='default'
          disabled={connectState !== 'connected' && message.length > 0}
          onClick={async () => {
            const data = new TextEncoder().encode(message)
            await writeToSerial(data)
          }}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
