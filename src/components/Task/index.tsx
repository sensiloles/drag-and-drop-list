import React from 'react';
import styled, { AnyStyledComponent } from 'styled-components';
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { TaskTypes } from '../../types/index';

const Container: AnyStyledComponent = styled.div`
  padding: 8px;
  border: 1px solid gray;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(
    props: DraggableProps & DraggableStateSnapshot
  ): string => {
    let color: string;
    if (props.isDragging) {
      color = 'lightgreen';
    } else if (props.isDragDisabled) {
      color = 'lightgrey';
    } else {
      color = 'white';
    }

    return color;
  }};
  display: flex;
`;

const Handle: AnyStyledComponent = styled.div`
  width: 20px;
  heigh: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 9px;
`;

interface TaskProps {
  key: number | string;
  task: TaskTypes;
  index: number;
}

export default function Task(
  props: TaskProps
): React.ReactElement<DraggableProps> {
  const {
    task: { id, content },
    index
  } = props;
  const isDragDisabled: boolean = id === 'task-1';

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(
        providet: DraggableProvided,
        snapshot: DraggableStateSnapshot
      ): React.ReactElement<any> => (
        <Container
          {...providet.draggableProps}
          {...providet.dragHandleProps}
          ref={providet.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled}
        >
          <Handle {...providet.dragHandleProps} />
          {content}
        </Container>
      )}
    </Draggable>
  );
}
