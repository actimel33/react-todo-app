import { memo} from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import { XCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "../store/BoardStore";
import { useModalStore } from "../store/ModalStore";
import { ITodo, TTypedColumn } from '../types'

type TProps = {
  todo: ITodo;
  index: number;
  id: TTypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps | null | undefined;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCardComponent = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TProps) => {
  const { deleteTask, seNewTaskInput, seNewTaskType } = useBoardStore();
  const { openModal } = useModalStore();

  const handleDeleteTask = () => {
    deleteTask(index, todo, id)
  }

  const handleEditTask = () => {
    seNewTaskType(todo.status)
    seNewTaskInput(todo.title);
    openModal({ ...todo, index });
  }
 
  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <div className="flex justify-between items-center gap-4">
          <button className='text-yellow-500 hover:text-violet-700' onClick={handleEditTask}>
            <PencilSquareIcon className='h-8 w-8' />
          </button>
          <button className='text-red-500 hover:text-red-700' onClick={handleDeleteTask}>
            <XCircleIcon className='h-8 w-8' />
          </button>
        </div> 
      </div>
    </div>
  );
};

export default memo(TodoCardComponent)