'use client'

import * as React from 'react'

import { cn } from '@shadcn/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@shadcn/components/ui/select'

interface WorkspaceSwitcherProps {
  isCollapsed: boolean
  workspaces: {
    label: string
    color: string
    icon: React.ReactNode
  }[]
}

export function WorkspaceSwitcher({
  isCollapsed,
  workspaces
}: WorkspaceSwitcherProps) {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<string>(
    workspaces[0].label
  )

  return (
    <Select
      defaultValue={selectedWorkspace}
      onValueChange={setSelectedWorkspace}
    >
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed &&
            'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden'
        )}
        aria-label='Select workspace'
      >
        {[selectedWorkspace].map((workspaceLabel) => {
          const currentWorkspaceItem = workspaces.find(
            (workspace) => workspace.label === workspaceLabel
          )
          return (
            <SelectValue placeholder='Select workspace'>
              {currentWorkspaceItem.icon}
              <span
                className={cn('ml-2', isCollapsed && 'hidden')}
                style={{ color: currentWorkspaceItem.color }}
              >
                {currentWorkspaceItem.label}
              </span>
            </SelectValue>
          )
        })}
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.label} value={workspace.label}>
            <div
              className='flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground'
              style={{
                color: workspace.color
              }}
            >
              {workspace.icon}
              {workspace.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
