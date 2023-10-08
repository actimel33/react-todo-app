import { Fragment, memo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '../store/ModalStore'
import { useBoardStore } from '../store/BoardStore'
import TaskTypedRadioGroup from './TaskTypedRadioGroup'
import { IColumn, TTypedColumn } from '../types'

const ModalComponent = () => {
  const { isOpen, closeModal, todo } = useModalStore();
  const { newTaskInput, newTaskType, board, seNewTaskInput, addTask, setBoardState, updateTodoInDB } = useBoardStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    if(!todo) {
      addTask(newTaskInput, newTaskType)
    } else {
      const columns =  Object.entries(board.columns);
      const startColumnIndex = columns.find((item: any) =>
        item.includes(todo.status as TTypedColumn)
      ) as [TTypedColumn, IColumn];

      const finishColumnIndex = columns.find((item: any) =>
        item.includes(newTaskType as TTypedColumn)
      ) as [TTypedColumn, IColumn];

      const startColumn: IColumn = {
        id: startColumnIndex?.[0],
        todos: startColumnIndex?.[1].todos,
      };
  
      const finishColumn: IColumn = {
        id: finishColumnIndex?.[0],
        todos: finishColumnIndex?.[1].todos,
      };

      if ((!startColumn || !finishColumn) || (startColumn === finishColumn) || (!startColumn.todos)) return;
      
      const newTodos = startColumn.todos ?? Array.from(startColumn?.todos);

      const [movedTodo] = newTodos.splice(todo.index, 1);

      movedTodo.title = newTaskInput || movedTodo.title;

      if (startColumn.id === finishColumn.id) {
        //same column task
        newTodos.splice(todo.index, 0, movedTodo);
        const newCol = {
          id: startColumn.id,
          todos: newTodos,
        };

        const newColumns = { ...board.columns };
        newColumns[startColumn.id] = newCol;

        setBoardState({ ...board, columns: newColumns });
      } else {
        // Status of another column
        const finishTodos = Array.from(finishColumn.todos);
        movedTodo.status = newTaskType
        
        finishTodos.splice(0, 0, movedTodo);
        const newColumns = { ...board.columns };
        const newCol = {
          id: startColumn.id,
          todos: newTodos,
        };

        newColumns[startColumn.id] = newCol;
        newColumns[finishColumn.id] = {
          id: finishColumn.id,
          todos: finishTodos,
        }

        setBoardState({ ...board, columns: newColumns });
      }

      // Update in DB
      updateTodoInDB(movedTodo, finishColumn.id);
    }
    
    closeModal();
  }
  
  return (
    // Use the `Transition` component at the root level
    <Transition show={isOpen} as={Fragment} >
      <Dialog 
        as='form'
        className="relative z-10"
        onClose={() => closeModal()}
        onSubmit={handleSubmit}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
          </div>
        </div>  
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 pb-2">
                  Add a Task
                </Dialog.Title>

                <div className="mt-2">
                  <input 
                    type="text" 
                    value={newTaskInput}
                    onChange={(e) => seNewTaskInput(e.target.value)}
                    placeholder='Enter a task here...'
                    className='w-full border border-gray-300 rounded-md outline-none p-5'
                  />
                </div>

                {/* Task Typed Radio Group */}
                <TaskTypedRadioGroup />
                <div className='mt-2'>
                  <button 
                    type='submit'
                    disabled={!newTaskInput}
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-950 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'>
                    {todo ? 'Edit Task' : 'Add Task'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>  
      </Dialog>
    </Transition>
  )
}

export default memo(ModalComponent)