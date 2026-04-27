import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  loadFromStorage,
  saveToStorage,
  generateId,
} from "../utils/localStorage";
import {
  DEFAULT_COLUMNS,
  DEFAULT_CARDS,
  DEFAULT_USERS,
  DEFAULT_TAGS,
  PRIORITIES,
} from "../utils/constants";
import { isOverdue } from "../utils/dateUtils";
import Column from "./column";
import CardModal from "./CardModal";
import StatsPanel from "./StatsPanel";
import SearchFilter from "./SearchFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      cards: {},
      users: DEFAULT_USERS,
      tags: DEFAULT_TAGS,
      columnOrder: [],
      selectedCard: null,
      isModalOpen: false,
      showStats: true,
      searchQuery: "",
      filters: {
        assignee: null,
        priority: null,
        tag: null,
        overdue: false,
      },
      editingColumnId: null,
      editingColumnTitle: "",
      showDeleteConfirm: null,
    };
  }

  initializeData = () => {
    const savedData = loadFromStorage();
    if (savedData && savedData.columns && savedData.columns.length > 0) {
      return {
        columns: savedData.columns,
        cards: savedData.cards || {},
        users: savedData.users || DEFAULT_USERS,
        tags: savedData.tags || DEFAULT_TAGS,
        columnOrder:
          savedData.columnOrder || savedData.columns.map((col) => col.id),
      };
    }

    return {
      columns: DEFAULT_COLUMNS,
      cards: DEFAULT_CARDS,
      users: DEFAULT_USERS,
      tags: DEFAULT_TAGS,
      columnOrder: DEFAULT_COLUMNS.map((col) => col.id),
    };
  };

  componentDidMount() {
    const initialData = this.initializeData();
    this.setState({
      columns: initialData.columns,
      cards: initialData.cards,
      users: initialData.users,
      tags: initialData.tags,
      columnOrder: initialData.columnOrder,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { columns, cards, users, tags, columnOrder } = this.state;
    if (
      prevState.columns !== columns ||
      prevState.cards !== cards ||
      prevState.users !== users ||
      prevState.tags !== tags ||
      prevState.columnOrder !== columnOrder
    ) {
      saveToStorage({ columns, cards, users, tags, columnOrder });
    }
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      this.setState({ columnOrder: newColumnOrder });
      return;
    }

    const startColumn = this.state.columns.find(
      (col) => col.id === source.droppableId
    );
    const endColumn = this.state.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!startColumn || !endColumn) return;

    if (startColumn.id === endColumn.id) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, cardIds: newCardIds };
      this.setState((prev) => ({
        columns: prev.columns.map((col) =>
          col.id === newColumn.id ? newColumn : col
        ),
      }));
    } else {
      const startCardIds = Array.from(startColumn.cardIds);
      startCardIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, cardIds: startCardIds };

      const endCardIds = Array.from(endColumn.cardIds);
      endCardIds.splice(destination.index, 0, draggableId);
      const newEndColumn = { ...endColumn, cardIds: endCardIds };

      this.setState((prev) => ({
        columns: prev.columns.map((col) => {
          if (col.id === newStartColumn.id) return newStartColumn;
          if (col.id === newEndColumn.id) return newEndColumn;
          return col;
        }),
      }));
    }
  };

  addColumn = () => {
    const newColumn = {
      id: `column-${generateId()}`,
      title: "新列表",
      cardIds: [],
    };
    this.setState((prev) => ({
      columns: [...prev.columns, newColumn],
      columnOrder: [...prev.columnOrder, newColumn.id],
      editingColumnId: newColumn.id,
      editingColumnTitle: "新列表",
    }));
  };

  deleteColumn = (columnId) => {
    const column = this.state.columns.find((col) => col.id === columnId);
    if (!column) return;

    const newCards = { ...this.state.cards };
    column.cardIds.forEach((cardId) => {
      delete newCards[cardId];
    });

    this.setState((prev) => ({
      columns: prev.columns.filter((col) => col.id !== columnId),
      columnOrder: prev.columnOrder.filter((id) => id !== columnId),
      cards: newCards,
      showDeleteConfirm: null,
    }));
  };

  updateColumnTitle = (columnId, newTitle) => {
    if (!newTitle.trim()) return;
    this.setState((prev) => ({
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle.trim() } : col
      ),
      editingColumnId: null,
    }));
  };

  addCard = (columnId) => {
    const newCard = {
      id: `card-${generateId()}`,
      title: "",
      description: "",
      assignee: null,
      priority: "medium",
      dueDate: null,
      tags: [],
      subtasks: [],
      comments: [],
      createdAt: Date.now(),
    };

    this.setState((prev) => ({
      cards: { ...prev.cards, [newCard.id]: newCard },
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: [...col.cardIds, newCard.id] }
          : col
      ),
      selectedCard: newCard,
      isModalOpen: true,
    }));
  };

  updateCard = (updatedCard) => {
    this.setState((prev) => ({
      cards: { ...prev.cards, [updatedCard.id]: updatedCard },
      selectedCard: updatedCard,
    }));
  };

  deleteCard = (cardId, columnId) => {
    this.setState((prev) => {
      const newCards = { ...prev.cards };
      delete newCards[cardId];
      return {
        cards: newCards,
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
            : col
        ),
        isModalOpen: false,
        selectedCard: null,
      };
    });
  };

  openCardModal = (card) => {
    this.setState({ selectedCard: card, isModalOpen: true });
  };

  closeCardModal = () => {
    this.setState({ isModalOpen: false, selectedCard: null });
  };

  getFilteredCards = (columnCardIds) => {
    const { searchQuery, filters } = this.state;
    const { cards } = this.state;

    return columnCardIds.filter((cardId) => {
      const card = cards[cardId];
      if (!card) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          card.title.toLowerCase().includes(query) ||
          (card.description && card.description.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.assignee && card.assignee !== filters.assignee) {
        return false;
      }

      if (filters.priority && card.priority !== filters.priority) {
        return false;
      }

      if (filters.tag && !card.tags.includes(filters.tag)) {
        return false;
      }

      if (filters.overdue && !isOverdue(card.dueDate)) {
        return false;
      }

      return true;
    });
  };

  getStats = () => {
    const { columns, cards } = this.state;
    const totalCards = Object.keys(cards).length;
    const completedColumn = columns.find((col) => col.title === "已完成");
    const completedCards = completedColumn ? completedColumn.cardIds.length : 0;
    const overdueCards = Object.values(cards).filter((card) =>
      isOverdue(card.dueDate)
    ).length;

    return {
      totalCards,
      completedCards,
      overdueCards,
      completionRate:
        totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0,
      columns: columns.map((col) => ({
        id: col.id,
        title: col.title,
        count: col.cardIds.length,
      })),
    };
  };

  render() {
    const {
      columns,
      cards,
      users,
      tags,
      columnOrder,
      selectedCard,
      isModalOpen,
      showStats,
      searchQuery,
      filters,
      editingColumnId,
      editingColumnTitle,
      showDeleteConfirm,
    } = this.state;
    const stats = this.getStats();

    return (
      <div className="kanban-app">
        <header className="kanban-header">
          <div className="header-content">
            <h1 className="app-title">项目看板</h1>
            <div className="header-actions">
              <SearchFilter
                searchQuery={searchQuery}
                filters={filters}
                users={users}
                tags={tags}
                onSearchChange={(query) =>
                  this.setState({ searchQuery: query })
                }
                onFilterChange={(newFilters) =>
                  this.setState({ filters: { ...filters, ...newFilters } })
                }
              />
              <button
                className="stats-toggle-btn"
                onClick={() => this.setState({ showStats: !showStats })}
              >
                {showStats ? "隐藏统计" : "显示统计"}
              </button>
            </div>
          </div>
        </header>

        <div className="kanban-main">
          <div className="board-container">
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    className="board"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columnOrder.map((columnId, index) => {
                      const column = columns.find((col) => col.id === columnId);
                      if (!column) return null;

                      const filteredCardIds = this.getFilteredCards(
                        column.cardIds
                      );

                      return (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={
                                snapshot.isDragging
                                  ? "column dragging"
                                  : "column"
                              }
                            >
                              <Column
                                column={column}
                                cards={cards}
                                users={users}
                                tags={tags}
                                filteredCardIds={filteredCardIds}
                                isEditing={editingColumnId === column.id}
                                editingTitle={editingColumnTitle}
                                onEditTitle={(title) =>
                                  this.setState({ editingColumnTitle: title })
                                }
                                onUpdateTitle={() =>
                                  this.updateColumnTitle(
                                    column.id,
                                    editingColumnTitle
                                  )
                                }
                                onStartEdit={() =>
                                  this.setState({
                                    editingColumnId: column.id,
                                    editingColumnTitle: column.title,
                                  })
                                }
                                onCancelEdit={() =>
                                  this.setState({ editingColumnId: null })
                                }
                                onDelete={() =>
                                  this.setState({
                                    showDeleteConfirm: {
                                      type: "column",
                                      id: column.id,
                                    },
                                  })
                                }
                                onAddCard={() => this.addCard(column.id)}
                                onCardClick={(card) => this.openCardModal(card)}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    <div className="add-column-container">
                      <button
                        className="add-column-btn"
                        onClick={this.addColumn}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>添加列表</span>
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {showStats && (
            <StatsPanel stats={stats} columns={columns} cards={cards} />
          )}
        </div>

        {isModalOpen && selectedCard && (
          <CardModal
            card={selectedCard}
            columns={columns}
            users={users}
            tags={tags}
            onClose={this.closeCardModal}
            onUpdate={this.updateCard}
            onDelete={(cardId, columnId) => this.deleteCard(cardId, columnId)}
          />
        )}

        {showDeleteConfirm && (
          <div
            className="modal-overlay"
            onClick={() => this.setState({ showDeleteConfirm: null })}
          >
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h3>确认删除</h3>
              <p>
                {showDeleteConfirm.type === "column"
                  ? "确定要删除此列表吗？列表中的所有卡片也将被删除。"
                  : "确定要删除此卡片吗？"}
              </p>
              <div className="confirm-actions">
                <button
                  className="btn-cancel"
                  onClick={() => this.setState({ showDeleteConfirm: null })}
                >
                  取消
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (showDeleteConfirm.type === "column") {
                      this.deleteColumn(showDeleteConfirm.id);
                    } else {
                      this.deleteCard(
                        showDeleteConfirm.id,
                        showDeleteConfirm.columnId
                      );
                    }
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Board;
