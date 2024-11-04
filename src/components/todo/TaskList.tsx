import { Droppable, Draggable } from 'react-beautiful-dnd'

type Task = {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Task[];
  dueDate?: string;
  assignee?: string;
}

type TaskListProps = {
  title: string;
  tasks: Task[];
  onTaskToggle: (taskId: string, parentId?: string) => void;
  onTaskComplete: (task: Task) => void;
  isSubtask?: boolean;
  droppableId: string;
}

export default function TaskList({ 
  title, 
  tasks, 
  onTaskToggle, 
  onTaskComplete,
  isSubtask = false,
  droppableId
}: TaskListProps) {
  return (
    <div className={`${!isSubtask ? 'mb-6' : 'ml-8 mt-2'}`}>
      {!isSubtask && (
        <div className="flex items-center mb-3">
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          {title === "To Do" && (
            <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-sm text-gray-600">
              {tasks.length}
            </span>
          )}
        </div>
      )}
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {
                              if (!task.completed) {
                                onTaskToggle(task.id);
                                if (!task.subtasks?.length) {
                                  onTaskComplete(task);
                                }
                              }
                            }}
                            className="w-4 h-4 rounded-full border-2 border-gray-300 
                                   checked:bg-blue-500 checked:border-blue-500 
                                   transition-colors cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className={`${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                              {task.title}
                            </span>
                            {(task.dueDate || task.assignee) && (
                              <div className="flex items-center space-x-2 mt-1">
                                {task.dueDate && (
                                  <span className="text-xs text-red-500">
                                    Due {task.dueDate}
                                  </span>
                                )}
                                {task.assignee && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                    {task.assignee}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
                          ⋮
                        </button>
                      </div>
                      {/* 子任务 */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="border-l-2 border-gray-200 ml-4">
                          <TaskList
                            title=""
                            tasks={task.subtasks}
                            onTaskToggle={(subtaskId) => onTaskToggle(subtaskId, task.id)}
                            onTaskComplete={onTaskComplete}
                            isSubtask={true}
                            droppableId={`${droppableId}-${task.id}-subtasks`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}