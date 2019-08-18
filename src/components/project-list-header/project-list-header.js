import React from 'react';
import './project-list-header.css';

const ProjectListHeader = ({toDo, done, header, listID, onProjectDeleted, onProjectEdited}) => {
    return (
        <div className="app-header d-flex ">
            <h1>{header}</h1>
            <button
                type="button"
                className="btn btn-outline-light btn-lg float-right"
                onClick={onProjectDeleted}
            >
                <i className="fa fa-trash-o"/>
            </button>

            <button
                type="button"
                className="btn btn-outline-light btn-lg float-right"
                onClick={onProjectEdited}
            >
                <i className="fa fa-pencil"/>
            </button>

            <h2>{toDo} more to do, {done} done</h2>
        </div>
    );
};

export default ProjectListHeader;
