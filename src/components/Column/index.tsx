import React, { ReactNode } from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided
} from 'react-beautiful-dnd';
import { TaskTypes, ColumnTypes } from '../../types/index';
import Task from '../Task';

const Container: AnyStyledComponent = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;
const Title: AnyStyledComponent = styled.h3`
  padding: 8px;
`;
const TaskList: AnyStyledComponent = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props: DroppableStateSnapshot): string =>
    props.isDraggingOver ? 'skyblue' : 'white'};
  flex-grow: 1;
  min-height: 100px;
`;

export interface ColumnProps {
  key?: string | number;
  column: ColumnTypes;
  tasks: TaskTypes[];
  isDropDisabled?: boolean;
  index: number;
}

interface InnerListProps {
  tasks: TaskTypes[];
}

class InnerList extends React.Component<InnerListProps> {
  shouldComponentUpdate(nextProps: InnerListProps): boolean {
    const { tasks } = this.props;

    if (nextProps.tasks === tasks) {
      return false;
    }

    return true;
  }

  render(): ReactNode {
    const { tasks } = this.props;

    return tasks.map(
      (task: TaskTypes, index: number): React.ReactElement<HTMLElement> => (
        <Task key={task.id} task={task} index={index} />
      )
    );
  }
}

export default function Column(
  props: ColumnProps
): React.ReactElement<HTMLElement> {
  const {
    column: { title, id },
    tasks,
    // isDropDisabled,
    index
  } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided): React.ReactElement<HTMLElement> => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{title}</Title>
          <Droppable
            droppableId={id}
            // isDropDisabled={isDropDisabled}
            type="task"
          >
            {(
              providet: DroppableProvided,
              snapshot: DroppableStateSnapshot
            ): React.ReactElement<HTMLElement> => (
              <TaskList
                ref={providet.innerRef}
                {...providet.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList tasks={tasks} />
                {providet.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}
