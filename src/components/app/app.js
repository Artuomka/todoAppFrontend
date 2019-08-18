import React from 'react';
import ProjectList from '../project-list';
import './app.css';

class App extends React.Component {
    listCount = 2;

    state ={
        listData: [
            {listName: 'Todo List 1', listID: 1},
            {listName: 'Todo List 2', listID: 2},
        ]
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
       // this.eventEmit('deleteProject', listID);
    };

    onProjectEdited = (listID) => {
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
            return {
                listData: newArray
            };
        });
    };

    render() {
        const elements = this.state.listData.map((item)=>{
            const {listID, listName, onProjectDeleted, onProjectEdited} = item;

            return(
                <li key={listID} className="project-list-item">
                    <ProjectList
                                listID={listID}
                                header={listName}
                                onProjectDeleted={()=>this.onProjectDeleted(listID)}
                                onProjectEdited={()=>this.onProjectEdited(listID)}
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