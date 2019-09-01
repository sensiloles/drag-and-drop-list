import React from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DroppableProps
} from 'react-beautiful-dnd';
import { TaskTypes, ColumnTypes } from '../../types/index';
import Task from '../Task';

const Container: AnyStyledComponent = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
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
  key: string | number;
  column: ColumnTypes;
  tasks: TaskTypes[];
}

export default function Column(
  props: ColumnProps
): React.ReactElement<DroppableProps> {
  const {
    column: { title, id },
    tasks
  } = props;

  return (
    <Container>
      <Title>{title}</Title>
      <Droppable droppableId={id} type={id === 'column-3' ? 'done' : 'active'}>
        {(
          providet: DroppableProvided,
          snapshot: DroppableStateSnapshot
        ): React.ReactElement<any> => (
          <TaskList
            ref={providet.innerRef}
            {...providet.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {providet.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
