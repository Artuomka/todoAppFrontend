import React from 'react';
import io from 'socket.io-client';
import ProjectListHeader from '../project-list-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';
import './project-list.css';

let socket = io('http://localhost:9000');


class ProjectList extends React.Component {

    maxId = 0;

    state = {
        todoData: [
            {label: 'Buy a milk', imortant: false, done: false, id: 0},
            {label: 'Call mam', imortant: false, done: false, id: 1},
            {label: 'Clean the Room', imortant: false, done: false, id: 2},
            {label: 'Repair DVD Player', imortant: false, done: false, id: 3}
        ],
        term: '',
        filter: 'all' //all, active, done
    };

    //****************************************************************************

    setDataOnConnection(items) {
        let newItemsArray = [];
        for (let i = 0; i < items.length; i++) {
            const label        = items[i].label;
            const newImportant = items[i].important;
            const newDone      = items[i].done;
            const newId        = items[i].id;
            let newItem        = {
                label,
                important: newImportant,
                done: newDone,
                id: newId
            };
            newItemsArray.push(newItem);
            this.maxId = newItemsArray.length;
        }

        this.setState(() => {
            return {
                todoData: newItemsArray
            };
        });
    }

    componentDidMount() {
        socket.on('connect', socket => {
            console.log('Connection to socket.io emitted');
        });

        socket.on('setItems', items => {
            console.log('Set Items Emitted ' + JSON.stringify(items));
            this.setDataOnConnection(items);
        });

    };

    eventEmit(event, data) {
        socket.emit(event, data);
    };

    //***************************************************************************

    createTodoItem(label) {
        const newItem = {
            label,
            important: false,
            done: false,
            id: this.maxId
        };
        //console.log('')
        this.eventEmit('createTodoItem', newItem);

        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        };
    };

    deleteItem = (id) => {
        console.log(id);
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, ...after];

            return {
                todoData: newArray
            };
        });
        this.eventEmit('deleteItem', id);
    };

    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newArray = [...todoData, newItem];
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

            return {
                todoData: newArray
            }

        });
        this.eventEmit('onToggleImportant', id);
    };

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const oldItem  = todoData[idx];
            const newItem  = {...oldItem, important: !oldItem.important};
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];

            return {
                todoData: newArray
            }

        });
        this.eventEmit('onToggleImportant', id);
    };

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            const idx      = todoData.findIndex((el) => el.id === id);
            const oldItem  = todoData[idx];
            const newItem  = {...oldItem, done: !oldItem.done};
            const before   = todoData.slice(0, idx);
            const after    = todoData.slice(idx + 1);
            const newArray = [...before, newItem, ...after];

            return {
                todoData: newArray
            }

        });
        //      console.log('Toggle done ', id);
        this.eventEmit('onToggleDone', id);
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
        const {header, onProjectDeleted, onProjectEdited} = this.props;

        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (

            <div className="project-list border border-secondary">
                <ProjectListHeader toDo={todoCount}
                                   done={doneCount}
                                   header={header}
                                   onProjectDeleted = {onProjectDeleted}
                                   onProjectEdited = {onProjectEdited}

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
                />
                <ItemAddForm onItemAdded={this.addItem}/>
            </div>
        );
    }
};

export default ProjectList;
