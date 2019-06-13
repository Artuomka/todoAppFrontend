import React from 'react';
import './item-add-form.css';

class ItemAddForm extends React.Component {
    render() {
        return (
            <div className="item-add-form">
                <button className="btn btn-outline-secondary"
                        onClick={() => this.props.onItemAdded('"Some task"')}
                >Add Item
                </button>
            </div>
        );
    };
};

export default ItemAddForm;