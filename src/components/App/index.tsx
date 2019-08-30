import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import '@atlaskit/css-reset';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import initialData from '../../data/initial-data';
import Column from '../Column';

const App = (): JSX.Element => {
  const [state, setState] = useState(initialData);

  function onDragEnd(result: DropResult): void {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const column = state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn
      }
    };

    setState(newState);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {state.columnOrder.map(columnId => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map(tastId => state.tasks[tastId]);

        return <Column key={columnId} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
};

export default hot(module)(App);
