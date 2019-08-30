export interface InitialData {
  tasks: {
    [key: string]: TaskTypes;
  };
  columns: {
    [key: string]: ColumnTypes;
  };
  columnOrder: [string];
}

export interface TaskTypes {
  id: string;
  content: string;
}

export interface ColumnTypes {
  id: string;
  title: string;
  taskIds: string[];
}
