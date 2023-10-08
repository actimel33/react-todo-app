import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "../store/BoardStore";
import { ITodo, TTypedColumn } from "../types";
import { useModalStore } from "../store/ModalStore";


type Props = {
  id: TTypedColumn;
  todos: ITodo[];
};

const idToColumnText: { [key in TTypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export default function Column({ id, todos }: Props) {
  const { searchString, seNewTaskType, seNewTaskInput } = useBoardStore();
  const { openModal } = useModalStore()

  const handleAddTodo = () => {
    seNewTaskType(id);
    seNewTaskInput('')
    openModal();
  }
  return (
    <Droppable droppableId={id.toString()} type='card'>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`p-2 rounded-2xl shadow-sm ${
            snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
          }`}
        >
          <h2 className='flex justify-between items-center font-bold text-xl p-2'>
            {idToColumnText[id]}
            <span className='text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal'>
              {!searchString
                ? todos.length
                : todos.filter((todo) =>
                    todo.title
                      .toLowerCase()
                      .includes(searchString.toLowerCase())
                  ).length}
            </span>
          </h2>

          <div className='space-y-2'>
            {todos.map((todo, index) => {
              if (
                searchString &&
                !todo.title
                  .toLowerCase()
                  .includes(searchString.toLowerCase())
              ) {
                return null;
              }
              return (
                <Draggable
                  key={todo.$id}
                  draggableId={todo.$id}
                  index={index}
                >
                  {(provided) => (
                    <TodoCard
                      todo={todo}
                      index={index}
                      id={id}
                      innerRef={provided.innerRef}
                      draggableProps={provided.draggableProps}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}

            <div className='flex items-end justify-end '>
              <button onClick={handleAddTodo}>
                <PlusCircleIcon className='h-10 w-10 text-green-500 hover:text-green-600' />
              </button>
            </div>
          </div>
        </div>
      )}
  </Droppable>
  );
}