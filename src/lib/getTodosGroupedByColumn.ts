import { initialBoardState } from "../store/BoardStore";
import { IBoard, IColumn, TTypedColumn } from "../types";
import { databases } from "./appwrite";

export const getTodosGroupedByColumn = async () => {
  
  const data = await databases.listDocuments(
    process.env.REACT_APP_PUBLIC_DATABASE_ID!,
    process.env.REACT_APP_PUBLIC_TODOS_COLLECTION_ID!,
  );

  const todos = data.documents;


  const columns = todos.reduce((acc: any, todo: any) => {
    if (!acc[todo.status]) {
      acc[todo.status] = {
        id: todo.status,
        todos: [],
      };
    }
    
    acc[todo.status]!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
    });

    return acc as Record<TTypedColumn, IColumn>;
  }, initialBoardState);

  const columnTypes: TTypedColumn[] = ["todo", "inprogress", "done"];

  columnTypes.forEach((columnType) => {
    if (!columns[columnType]) {
      columns[columnType] = {
        id: columnType,
        todos: [],
      };
    }
  });
   
 
  const board: IBoard = { columns };

  return board;
};
