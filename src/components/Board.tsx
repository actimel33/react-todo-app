import { useBoardStore } from "../store/BoardStore";
import { useEffect, memo } from "react";
import { DragDropContext, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import Column from "./Column";
import { IColumn, TTypedColumn } from "../types";

const BoardComponent = () => {
  const { board, getBoard, setBoardState, updateTodoInDB } = useBoardStore();

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Check if user dragged card outside of board
    if (!destination) return;

    // Handle card dragged
    const columns = Object.entries(board.columns);
    const startColumnIndex = columns.find((item: any) =>
      item.includes(source.droppableId as TTypedColumn)
    ) as [TTypedColumn, IColumn];

    const finishColumnIndex = columns.find((item: any) =>
      item.includes(destination.droppableId as TTypedColumn)
    ) as [TTypedColumn, IColumn];

    const startColumn: IColumn = {
      id: startColumnIndex?.[0],
      todos: startColumnIndex?.[1].todos,
    };

    const finishColumn: IColumn = {
      id: finishColumnIndex?.[0],
      todos: finishColumnIndex?.[1].todos,
    };

    if (!startColumn || !finishColumn) return;
    if (startColumn === finishColumn) {
      return;
    }
    if (!startColumn.todos) return;

    const newTodos = startColumn.todos ?? Array.from(startColumn?.todos);

    const [movedTodo] = newTodos.splice(source.index, 1);

    if (startColumn.id === finishColumn.id) {
      //same column task drag
      newTodos.splice(destination.index, 0, movedTodo);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };

      const newColumns = { ...board.columns };
      newColumns[startColumn.id] = newCol;

      setBoardState({ ...board, columns: newColumns });
    } else {
      // dragging to another column
      
      const finishTodos = Array.from(finishColumn.todos);
      
      movedTodo.status = finishColumn.id;
      finishTodos.splice(destination.index, 0, movedTodo);
      const newColumns = { ...board.columns };
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };

      newColumns[startColumn.id] = newCol;
      newColumns[finishColumn.id] = {
        id: finishColumn.id,
        todos: finishTodos,
      };

      // Update in DB
      updateTodoInDB(movedTodo, finishColumn.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
          >
            {Object.entries(board.columns).map(([id, column] , index) => (
              <Column key={id} id={id as TTypedColumn} todos={column.todos} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(BoardComponent)