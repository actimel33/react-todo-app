

import { create } from "zustand";
import { IBoard, IColumn, ITodo, TTypedColumn } from "../types";
import { getTodosGroupedByColumn } from "../lib/getTodosGroupedByColumn";
import { ID, databases } from "../lib/appwrite";

export const initialBoardState: Record<TTypedColumn, IColumn> = {
  todo: {
    id: "todo",
    todos: []
  },
  inprogress: {
    id: "inprogress", 
    todos: []
  },
  done: {
    id: "done",
    todos: []
  }
}

interface IBoardState {
  board: IBoard;
  getBoard: () => void;
  setBoardState: (board: IBoard) => void;
  updateTodoInDB: (todo: ITodo, columnId: TTypedColumn) => void;
  addTask: (todo: string, columnId: TTypedColumn) => void;
  deleteTask: (taskIndex: number, todo: ITodo, id: TTypedColumn) => void;

  newTaskInput: string;
  newTaskType: TTypedColumn;
  seNewTaskInput: (input: string) => void;
  seNewTaskType: (columnId: TTypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;
}


export const useBoardStore = create<IBoardState>((set, get) => ({
  board: {
    columns: initialBoardState,
  },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.REACT_APP_PUBLIC_DATABASE_ID!,
      process.env.REACT_APP_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  setBoardState: (board) => set({ board }),
  setSearchString: (searchString) => set({ searchString }),
  seNewTaskInput: (newTaskInput) => set({ newTaskInput }),
  seNewTaskType: (newTaskType) => set({ newTaskType }),
  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = { ...get().board.columns };

    newColumns[id]?.todos.splice(taskIndex, 1);

    await databases.deleteDocument(
      process.env.REACT_APP_PUBLIC_DATABASE_ID!,
      process.env.REACT_APP_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );

    set({ board: { columns: newColumns } });
  },
  addTask: async (todo, columnId) => {
    const { $id } = await databases.createDocument(
      process.env.REACT_APP_PUBLIC_DATABASE_ID!,
      process.env.REACT_APP_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
      }
    );
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = { ...state.board.columns };

      const newTodo: ITodo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
      };

      const column = newColumns[columnId];

      if(!column) {
        newColumns[columnId] = {
          id: columnId,
          todos: [newTodo],
        }
      } else {
        newColumns[columnId]?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns,
        }
      }
    })
  },
}));
