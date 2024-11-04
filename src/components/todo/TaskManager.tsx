'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import TaskList from './TaskList'

type Task = {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
}

const initialTasks = {
  todo: [
    { 
      id: '1', 
      title: 'finish the project', 
      completed: false,
      subtasks: [
        { id: '3', title: 'prepare the meeting materials', completed: false },
        { id: '4', title: 'update the document', completed: false },
      ]
    },
    { id: '2', title: 'reply the email', completed: false },
  ],
  done: [
    { id: '5', title: 'morning meeting', completed: true },
    { id: '6', title: 'code review', completed: true },
  ],
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<{
    todo: Task[];
    done: Task[];
  }>(initialTasks)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    setTasks(prev => {
      const newTasks = { ...prev }
      let sourceList: Task[]
      let destList: Task[]

      // Determine source and destination lists
      if (source.droppableId.includes('subtasks')) {
        const parentId = source.droppableId.split('-')[1]
        sourceList = newTasks.todo.find(t => t.id === parentId)?.subtasks || []
      } else {
        sourceList = newTasks[source.droppableId as keyof typeof newTasks]
      }

      if (destination.droppableId.includes('subtasks')) {
        const parentId = destination.droppableId.split('-')[1]
        destList = newTasks.todo.find(t => t.id === parentId)?.subtasks || []
      } else {
        destList = newTasks[destination.droppableId as keyof typeof newTasks]
      }

      // Execute move
      const [removed] = sourceList.splice(source.index, 1)
      destList.splice(destination.index, 0, removed)

      return newTasks
    })
  }

  const handleTaskToggle = (taskId: string, parentId?: string) => {
    setTasks(prev => {
      const newTasks = { ...prev }

      if (parentId) {
        // Handle subtasks
        newTasks.todo = newTasks.todo.map(task => {
          if (task.id === parentId) {
            return {
              ...task,
              subtasks: task.subtasks?.map(subtask =>
                subtask.id === taskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            }
          }
          return task
        })
      } else {
        // Check if the task is in the completed list
        const doneTask = newTasks.done.find(task => task.id === taskId)
        if (doneTask) {
          // If it's a completed task, move it back to the todo list
          newTasks.done = newTasks.done.filter(task => task.id !== taskId)
          newTasks.todo = [...newTasks.todo, { ...doneTask, completed: false }]
        } else {
          // Handle tasks in todo list
          newTasks.todo = newTasks.todo.map(task =>
            task.id === taskId
              ? { ...task, completed: !task.completed }
              : task
          )
        }
      }

      return newTasks
    })
  }

  const handleTaskComplete = (task: Task) => {
    setTasks(prev => ({
      todo: prev.todo.filter(t => t.id !== task.id),
      done: [...prev.done, { ...task, completed: true }]
    }))
  }

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
        <button className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 
                         transition-colors text-sm font-medium text-gray-700
                         border border-white/20">
          + Add Task
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-2">
          <TaskList 
            title="To Do" 
            tasks={tasks.todo}
            onTaskToggle={handleTaskToggle}
            onTaskComplete={handleTaskComplete}
            droppableId="todo"
          />
          <TaskList 
            title="Done" 
            tasks={tasks.done}
            onTaskToggle={handleTaskToggle}
            onTaskComplete={handleTaskComplete}
            droppableId="done"
          />
        </div>
      </DragDropContext>
    </div>
  )
}