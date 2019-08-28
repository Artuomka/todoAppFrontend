import React from 'react';
import ProjectListHeader from '../project-list-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';
import './project-list.css';

class ProjectList extends React.Component {
    listID = this.props;
    onListChanged = this.props.onListChanged;
    todoData = this.props.todoData;

    maxId = 0;

    newID(){
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    state = {
        todoData:
             [],
        term: '',
        filter: 'all' //all, active, done
    };

    componentDidMount() {
        this.setState(() => {
            const newArray = this.todoData;
            return {
                todoData: newArray
            }
        });
    };

    createTodoItem(label) {
        const newID = this.newID();
        return {
            label,
            important: false,
            done: false,
            id: newID
        };
    };

    deleteItem = (id) => {
        console.log(id);
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            };
        });
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);
        this.setState(({todoData}) => {
            const newArray = [...todoData, newItem];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    editItem = (id) => {
        this.setState(({todoData}) => {
            const newItemName = prompt("Enter new task name");
            if (newItemName===null){
                return;
            }
            if (newItemName.trim().length===0){
                alert("Task name cannot be empty!");
                return;
            }
            const idx      = todoData.findIndex((el) => el.id === id);
            const oldItem  = todoData[idx];
            const newItem  = {...oldItem, label: newItemName};
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const oldItem  = todoData[idx];
            const newItem  = {...oldItem, important: !oldItem.important};
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const oldItem  = todoData[idx];
            const newItem  = {...oldItem, done: !oldItem.done};
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    onToggleDown = (id) =>{
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            if (idx >= todoData.length-1) {
                alert("This item has lowest priority!");
                return;
            }
            const oldItem  = todoData[idx];
            const newItem  = todoData[idx+1];
            todoData[idx] = newItem;
            todoData[idx+1] = oldItem;
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    onToggleUp = (id) =>{
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            if (idx <= 0) {
                alert("This item has highest priority!");
                return;
            }
            const oldItem  = todoData[idx];
            const newItem  = todoData[idx-1];
            todoData[idx] = newItem;
            todoData[idx-1] = oldItem;
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];
            this.onListChanged(newArray, this.listID);
            return {
                todoData: newArray
            }
        });
    };

    search(items, term) {
        if (term.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    };

    onSearchChange = (term) => {
        this.setState({term});
    };

    onFilterChange = (filter) => {
        this.setState({filter});
    };

    filter(items, filter) {
        switch (filter) {
            case 'all':
                return items;

            case 'active':
                return items.filter((item) => !item.done);

            case 'done':
                return items.filter((item) => item.done);

            default:
                return items;
        }
    };

    render() {
        const {todoData, term, filter} = this.state;
        const visibleItems             = this.filter(this.search(todoData, term), filter);
        const {header, onProjectDeleted, onProjectEdited, onDateEdited} = this.props;

        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="project-list border border-secondary">
                <ProjectListHeader toDo={todoCount}
                                   done={doneCount}
                                   header={header}
                                   onProjectDeleted = {onProjectDeleted}
                                   onProjectEdited = {onProjectEdited}
                                   onDateEdited = {onDateEdited}
                />
                <div className="top-panel d-flex">
                    <SearchPanel
                        onSearchChange={this.onSearchChange}
                    />
                    <ItemStatusFilter filter={filter}
                                      onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList todos={visibleItems}
                          onDeleted={this.deleteItem}
                          onEdited = {this.editItem}
                          onToggleImportant={this.onToggleImportant}
                          onToggleDone={this.onToggleDone}
                          onToggleDown={this.onToggleDown}
                          onToggleUp={this.onToggleUp}
                />
                <ItemAddForm onItemAdded={this.addItem}/>
            </div>
        );
    }
}

export default ProjectList;
