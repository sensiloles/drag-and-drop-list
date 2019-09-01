import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import '@atlaskit/css-reset';
import {
  DragDropContext,
  DropResult,
  DragDropContextProps,
  DragUpdate
} from 'react-beautiful-dnd';
import styled, { AnyStyledComponent } from 'styled-components';
import initialData from '../../data/initial-data';
import Column, { ColumnProps } from '../Column';
import { InitialData, ColumnTypes, TaskTypes } from '../../types';

const Container: AnyStyledComponent = styled.div`
  display: flex;
`;

const App = (): React.ReactElement<DragDropContextProps> => {
  const [state, setState] = useState(initialData);

  function onDragStart(): void {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.5s ease';
  }

  function onDragUpdate(update: DragUpdate): void {
    const { destination } = update;
    const opacity: number = destination
      ? destination.index / Object.keys(state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  }

  function onDragEnd(result: DropResult): void {
    document.body.style.color = 'inherit';

    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start: ColumnTypes = state.columns[source.droppableId];
    const finish: ColumnTypes = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds: string[] = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn: ColumnTypes = {
        ...start,
        taskIds: newTaskIds
      };

      const newState: InitialData = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn
        }
      };

      setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds: string[] = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart: ColumnTypes = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds: string[] = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState: InitialData = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    setState(newState);
  }

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Container>
        {state.columnOrder.map(
          (columnId: string): React.ReactElement<ColumnProps> => {
            const column: ColumnTypes = state.columns[columnId];
            const tasks: TaskTypes[] = column.taskIds.map(
              (tastId: string): TaskTypes => state.tasks[tastId]
            );
            return <Column key={columnId} column={column} tasks={tasks} />;
          }
        )}
      </Container>
    </DragDropContext>
  );
};

export default hot(module)(App);
