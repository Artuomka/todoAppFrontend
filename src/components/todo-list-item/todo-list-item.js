import React from 'react';

import './todo-list-item.css';

class TodoListItem extends React.Component {

    state = {
        done: false,
        important: false
    };

    /*  onLabelClick = () => {
          this.setState((state) => {
              return {
                  done: !state.done
              }
          });
      };

      onMarkImportant = () => {
          this.setState((state) => {
              return {
                  important: !state.important
              };
          });
      };
  */

    render() {
        const {label, onDeleted, onEdited, onToggleImportant, onToggleDone, important, done} = this.props;
        // const {done, important} = this.state;
        let classNames = "todo-list-item";

        if (done) {
            classNames += " done";
        }

        if (important) {
            classNames += " important";
        }

        return (
            <span className={classNames}>
      <span
          className="todo-list-item-label"

          onClick={onToggleDone}
      >
        {label}
      </span>

      <button type="button"
              className="btn btn-outline-danger btn-sm float-right"
              onClick={onDeleted}
      >
        <i className="fa fa-trash-o"/>
      </button>

      <button type="button"
                 className="btn btn-outline-secondary btn-sm float-right"
                 onClick={onEdited}
         >
        <i className="fa fa-pencil"/>
      </button>

       <button type="button"
               className="btn btn-outline-success btn-sm float-right"
               onClick={onToggleImportant}
       >
        <i className="fa fa-exclamation"/>
      </button>

    </span>
        );
    };

}

export default TodoListItem;
