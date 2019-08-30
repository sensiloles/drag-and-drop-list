import React from 'react';
import styled from 'styled-components';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { TaskTypes, ColumnTypes } from '../../types/index';
import Task from '../Task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
`;

interface ColumnProps {
  key: string | number;
  column: ColumnTypes;
  tasks: TaskTypes[];
}

export default function Column(props: ColumnProps): JSX.Element {
  const {
    column: { title, id },
    tasks
  } = props;
  return (
    <Container>
      <Title>{title}</Title>
      <Droppable droppableId={id}>
        {(providet: DroppableProvided): JSX.Element => (
          <TaskList ref={providet.innerRef} {...providet.droppableProps}>
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
