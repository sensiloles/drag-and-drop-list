import React from 'react';
import styled from 'styled-components';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { TaskTypes } from '../../types/index';

const Container = styled.div`
  padding: 8px;
  border: 1px solid gray;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: lightgrey;
`;

interface TaskProps {
  key: number | string;
  task: TaskTypes;
  index: number;
}

export default function Task(props: TaskProps): JSX.Element {
  const {
    task: { id, content },
    index
  } = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(providet: DraggableProvided): JSX.Element => (
        <Container
          {...providet.draggableProps}
          {...providet.dragHandleProps}
          ref={providet.innerRef}
        >
          {content}
        </Container>
      )}
    </Draggable>
  );
}
