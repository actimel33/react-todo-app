export interface IBoard {
  columns: Record<TTypedColumn, IColumn>;
}

export type TTypedColumn = "todo" | "inprogress" | "done";

export interface IColumn {
  id: TTypedColumn;
  todos: ITodo[];
}

export interface ITodo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TTypedColumn;
}
