import React, { useState, ReactNode } from 'react';
import { hot } from 'react-hot-loader';
import '@atlaskit/css-reset';
import {
  DragDropContext,
  Droppable,
  DropResult,
  // DragUpdate,
  DragStart,
  DroppableProvided
} from 'react-beautiful-dnd';
import styled, { AnyStyledComponent } from 'styled-components';
import initialData from '../../data/initial-data';
import Column from '../Column';
import { InitialData, ColumnTypes, TaskTypes } from '../../types';

const Container: AnyStyledComponent = styled.div`
  display: flex;
`;

interface InnerListProps {
  column: ColumnTypes;
  taskMap: {
    [key: string]: TaskTypes;
  };
  index: number;
  isDropDisabled?: boolean;
}

class InnerList extends React.Component<InnerListProps> {
  shouldComponentUpdate(nextProps: InnerListProps): boolean {
    const { column, taskMap, index } = this.props;

    if (
      nextProps.column === column &&
      nextProps.taskMap === taskMap &&
      nextProps.index === index
    ) {
      return false;
    }

    return true;
  }

  render(): ReactNode {
    const { column, taskMap, index, isDropDisabled } = this.props;
    const tasks = column.taskIds.map((taskId: string) => taskMap[taskId]);

    return (
      <Column
        column={column}
        tasks={tasks}
        index={index}
        isDropDisabled={isDropDisabled}
      />
    );
  }
}

const App = (): React.ReactElement<HTMLElement> => {
  const [state, setState] = useState(initialData);

  function onDragStart(start: DragStart): void {
    const homeIndex: number = state.columnOrder.indexOf(
      start.source.droppableId
    );

    setState({
      ...state,
      homeIndex
    });
  }

  // function onDragUpdate(update: DragUpdate): void {
  //   const { destination } = update;
  //   const opacity: number = destination
  //     ? destination.index / Object.keys(state.tasks).length
  //     : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // }

  function onDragEnd(result: DropResult): void {
    setState({
      ...state,
      homeIndex: undefined
    });

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder: string[] = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState: InitialData = {
        ...state,
        columnOrder: newColumnOrder
      };

      setState(newState);
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
    const newFinish: ColumnTypes = {
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
      // onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided: DroppableProvided): React.ReactElement<HTMLElement> => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {state.columnOrder.map(
              (
                columnId: string,
                index: number
              ): React.ReactElement<HTMLElement> => {
                const column: ColumnTypes = state.columns[columnId];
                // const { homeIndex } = state;

                // const isDropDisabled: boolean = homeIndex
                //   ? index < homeIndex
                //   : false;

                return (
                  <InnerList
                    key={columnId}
                    column={column}
                    taskMap={state.tasks}
                    // isDropDisabled={isDropDisabled}
                    index={index}
                  />
                );
              }
            )}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default hot(module)(App);
