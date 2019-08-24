import React from 'react';
import ProjectList from '../project-list';
import './app.css';
import io from "socket.io-client";

let socket = io('http://localhost:9000');

class App extends React.Component {
    listCount = 0;

    state ={
        listData: [
            // {listName: 'Todo List 1', listID: 1},
            // {listName: 'Todo List 2', listID: 2},
        ]
    };

    componentDidMount() {
        socket.on('connect', socket => {
            console.log('Connection to socket.io emitted');
        });

        this.eventEmit('getProjects');

        socket.on('setProjects', items => {
            console.log('Set Items Emitted ' + JSON.stringify(items));
            this.setProjectsOnConnection(items);
        });

    };

    setProjectsOnConnection(items) {
        let newItemsArray = [];
        for (let i = 0; i < items.length; i++) {
            let newItem        = {
                listName: items[i].listName,
                listID: items[i].listID
            };
            newItemsArray.push(newItem);
            this.listCount = newItemsArray.length;
        }

        this.setState(() => {
            return {
                listData: newItemsArray
            };
        });
    }

    eventEmit(event, data) {
        socket.emit(event, data);
    };

    onListAdd = () => {
       const newItem = this.createProjectListItem(++this.listCount);
       if (newItem===undefined){
           return;
       }
       this.setState(({listData}) => {
            const newArray = [...listData, newItem];
            return {
                listData: newArray
            }
       });
        this.eventEmit('onListAdd', newItem);
    };

    createProjectListItem = (listCount) => {
        const newItemName = prompt("Enter the new project name (not more 14 characters long)");
        if (newItemName===null){
            return;
        }
        if (newItemName.trim().length===0){
            alert("Project name cannot be empty!");
            return;
        }
        if (newItemName.trim().length>14){
            alert("Project name is to long. It must be not more than 14 characters.");
            return;
        }
        const newItem = {
            listName: newItemName.trim(),
            listID: listCount
        };
        return newItem;
    };

    onProjectDeleted = (listID) => {
        this.setState(({listData}) => {
            const idx      = listData.findIndex((el) => el.listID === listID);
            const before   = listData.slice(0, idx);
            const after    = listData.slice(idx + 1);
            const newArray = [...before, ...after];

            return {
                listData: newArray
            };
        });
        this.eventEmit('onProjectDeleted', listID);
    };

    onProjectEdited = (listID) => {
        let editedProjectData = null;
        this.setState(({listData}) => {
            const idx      = listData.findIndex((el) => el.listID === listID);
            const newItemName = prompt("Enter new list name. (not more 14 characters long)");
            if (newItemName===null){
                return;
            }
            if (newItemName.trim().length===0){
                alert("Project name cannot be empty!");
                return;
            }
            if (newItemName.trim().length>14){
                alert("Project name is to long. It must be not more than 14 characters.");
                return;
            }
            let tmpItem = listData[idx];
            tmpItem.listName = newItemName;
            const newListItem = tmpItem;
            let newArray = listData;
            newArray[idx] = newListItem;
            editedProjectData = {
                listName: newItemName,
                listID: listID
            };
            return {
                listData: newArray
            };
        });
        if (editedProjectData != null) {
            this.eventEmit('onProjectEdited', editedProjectData);
        }
    };
// TODO realise datepicker
    onDateEdited = (listID) => {
        alert('LIST DATE EDIT CALLED!');
    };

    render() {
        const elements = this.state.listData.map((item)=>{
            const {listID, listName, onProjectDeleted, onProjectEdited, onDateEdited} = item;

            return(
                <li key={listID} className="project-list-item">
                    <ProjectList
                                listID={listID}
                                header={listName}
                                onProjectDeleted={()=>this.onProjectDeleted(listID)}
                                onProjectEdited={()=>this.onProjectEdited(listID)}
                                onDateEdited={()=>this.onDateEdited(listID)}
                    />
                </li>
            );
        });

        return (
            <div>
                <div className='head-text'>SIMPLE TODO LISTS</div>

                <ul>
                    { elements }
                </ul>

                <div className="btn-container">
                    <button type="button"
                            id="btnListAdd"
                            className="btn btn-primary btn-lg"
                            onClick={this.onListAdd}
                    >
                        Add TODO List
                    </button>
                </div>
            </div>
        );
    }
}

export default App;