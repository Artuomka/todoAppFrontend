import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './components/app-header/app-header';
import SearchPanel from './components/search-panel/search-panel';
import TodoList from './components/todo-list/todo-list';




const App = () => {

    const todoData = [
        {label: 'Drink Coffee', important: false, id:1},
        {label: 'Build App', important: true, id:2},
        {label: 'Have a lunch', important: false, id:3}
    ]




    const isLoggedIn = true;
    const loginBox = <span>Log in please</span>
    const welcomeBox = <span>Welcome Back</span>
    return (
        <div>
            {isLoggedIn ? welcomeBox : loginBox}
            <AppHeader/>
            <SearchPanel/>
            <TodoList todos={todoData}/>
        </div>
    );
};



ReactDOM.render(<App/>, document.getElementById('root'));