import React from 'react';

import TodoListItem from '../todo-list-item';
import './todo-list.css';

const TodoList = ({
                      todos,
                      onDeleted,
                      onEdited,
                      onToggleImportant,
                      onToggleDone,
                      onToggleDown,
                      onToggleUp,
                  }) => {

    const elements = todos.map((item) => {
        const {id, ...itemProps} = item;

        return (
            <li key={id} className="list-group-item">
                <TodoListItem
                    {...itemProps}
                    onDeleted={() => onDeleted(id)}
                    onEdited={() => onEdited(id)}
                    onToggleImportant={() => onToggleImportant(id)}
                    onToggleDone={() => onToggleDone(id)}
                    onToggleDown={() => onToggleDown(id)}
                    onToggleUp={() => onToggleUp(id)}
                />
            </li>
        );
    });

    return (
        <ul className="list-group todo-list">
            {elements}
        </ul>
    );
};

export default TodoList;
