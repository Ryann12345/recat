import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEllipsisH,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Card from "./card";

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  render() {
    const {
      column,
      cards,
      users,
      tags,
      filteredCardIds,
      isEditing,
      editingTitle,
      onEditTitle,
      onUpdateTitle,
      onStartEdit,
      onCancelEdit,
      onDelete,
      onAddCard,
      onCardClick,
      dragHandleProps,
    } = this.props;
    const { showMenu } = this.state;

    return (
      <div className="column-inner">
        <div className="column-header" {...dragHandleProps}>
          {isEditing ? (
            <div className="column-title-edit">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => onEditTitle(e.target.value)}
                onBlur={onUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onUpdateTitle();
                  if (e.key === "Escape") onCancelEdit();
                }}
                autoFocus
                className="column-title-input"
              />
            </div>
          ) : (
            <div className="column-title-row">
              <h3 className="column-title" onDoubleClick={onStartEdit}>
                {column.title}
              </h3>
              <span className="card-count">{filteredCardIds.length}</span>
              <div className="column-menu">
                <button
                  className="column-menu-btn"
                  onClick={() => this.setState({ showMenu: !showMenu })}
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
                {showMenu && (
                  <div className="column-menu-dropdown">
                    <button className="menu-item" onClick={onStartEdit}>
                      <FontAwesomeIcon icon={faEdit} />
                      <span>编辑列表</span>
                    </button>
                    <button className="menu-item danger" onClick={onDelete}>
                      <FontAwesomeIcon icon={faTrash} />
                      <span>删除列表</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Droppable droppableId={column.id} type="card">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`card-list ${
                snapshot.isDraggingOver ? "dragging-over" : ""
              }`}
            >
              {filteredCardIds.length === 0 ? (
                <div className="empty-state">
                  <p>暂无卡片</p>
                  <p className="empty-hint">点击下方按钮添加</p>
                </div>
              ) : (
                filteredCardIds.map((cardId, index) => {
                  const card = cards[cardId];
                  if (!card) return null;

                  return (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`card-wrapper ${
                            snapshot.isDragging ? "dragging" : ""
                          }`}
                        >
                          <Card
                            card={card}
                            users={users}
                            tags={tags}
                            onClick={() => onCardClick(card)}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="column-footer">
          <button className="add-card-btn" onClick={onAddCard}>
            <FontAwesomeIcon icon={faPlus} />
            <span>添加卡片</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Column;
