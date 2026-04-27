import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faTag,
  faUser,
  faCalendar,
  faFlag,
  faCheckSquare,
  faComment,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { PRIORITIES } from "../utils/constants";
import { formatDate, isOverdue } from "../utils/dateUtils";
import { generateId } from "../utils/localStorage";

class CardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      card: props.card,
      showLabelPicker: false,
      showUserPicker: false,
      showPriorityPicker: false,
      newSubtaskTitle: "",
      newComment: "",
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  closeAllPickers = () => {
    this.setState({
      showLabelPicker: false,
      showUserPicker: false,
      showPriorityPicker: false,
    });
  };

  handleKeyDown = (e) => {
    if (e.key === "Escape") {
      const {
        showLabelPicker,
        showUserPicker,
        showPriorityPicker,
      } = this.state;
      if (showLabelPicker || showUserPicker || showPriorityPicker) {
        this.closeAllPickers();
      } else {
        this.saveAndClose();
      }
    }
  };

  handleOverlayClick = () => {
    const { showLabelPicker, showUserPicker, showPriorityPicker } = this.state;
    if (showLabelPicker || showUserPicker || showPriorityPicker) {
      this.closeAllPickers();
    } else {
      this.saveAndClose();
    }
  };

  saveAndClose = () => {
    if (this.state.card.title.trim()) {
      this.props.onUpdate(this.state.card);
    }
    this.props.onClose();
  };

  updateCard = (updates) => {
    this.setState(
      (prev) => ({
        card: { ...prev.card, ...updates },
      }),
      () => {
        this.props.onUpdate(this.state.card);
      }
    );
  };

  toggleTag = (tagId) => {
    const tags = this.state.card.tags || [];
    const newTags = tags.includes(tagId)
      ? tags.filter((id) => id !== tagId)
      : [...tags, tagId];
    this.updateCard({ tags: newTags });
  };

  setAssignee = (userId) => {
    this.updateCard({ assignee: userId });
    this.setState({ showUserPicker: false });
  };

  setPriority = (priority) => {
    this.updateCard({ priority });
    this.setState({ showPriorityPicker: false });
  };

  addSubtask = () => {
    const { newSubtaskTitle, card } = this.state;
    if (!newSubtaskTitle.trim()) return;

    const newSubtask = {
      id: `sub-${generateId()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    this.updateCard({
      subtasks: [...(card.subtasks || []), newSubtask],
    });
    this.setState({ newSubtaskTitle: "" });
  };

  toggleSubtask = (subtaskId) => {
    const { card } = this.state;
    const subtasks = card.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    this.updateCard({ subtasks });
  };

  deleteSubtask = (subtaskId) => {
    const { card } = this.state;
    const subtasks = card.subtasks.filter((st) => st.id !== subtaskId);
    this.updateCard({ subtasks });
  };

  addComment = () => {
    const { newComment, card } = this.state;
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `comment-${generateId()}`,
      userId: this.props.users[0]?.id,
      content: newComment.trim(),
      createdAt: Date.now(),
    };

    this.updateCard({
      comments: [...(card.comments || []), newCommentObj],
    });
    this.setState({ newComment: "" });
  };

  deleteComment = (commentId) => {
    const { card } = this.state;
    const comments = card.comments.filter((c) => c.id !== commentId);
    this.updateCard({ comments });
  };

  getCurrentColumn = () => {
    const { card, columns } = this.props;
    return columns.find((col) => col.cardIds.includes(card.id));
  };

  getAssignee = () => {
    const { card, users } = this.props;
    return users.find((u) => u.id === card.assignee);
  };

  getCardTags = () => {
    const { card, tags } = this.props;
    return (card.tags || [])
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter(Boolean);
  };

  render() {
    const {
      card,
      showLabelPicker,
      showUserPicker,
      showPriorityPicker,
      newSubtaskTitle,
      newComment,
    } = this.state;
    const { onDelete, users, tags } = this.props;
    const currentColumn = this.getCurrentColumn();
    const assignee = this.getAssignee();
    const cardTags = this.getCardTags();
    const priority =
      PRIORITIES[card.priority?.toUpperCase()] || PRIORITIES.MEDIUM;

    const completedSubtasks = (card.subtasks || []).filter((s) => s.completed)
      .length;
    const totalSubtasks = (card.subtasks || []).length;

    return (
      <div className="modal-overlay" onClick={this.handleOverlayClick}>
        <div className="card-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-row">
              <input
                type="text"
                className="modal-title"
                value={card.title}
                onChange={(e) => this.updateCard({ title: e.target.value })}
                placeholder="卡片标题"
              />
              <button className="modal-close" onClick={this.saveAndClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {currentColumn && (
              <p className="modal-location">
                在列表 <strong>{currentColumn.title}</strong> 中
              </p>
            )}
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faTag} />
                <span>标签</span>
              </h3>
              <div className="section-content">
                <div className="tag-display">
                  {cardTags.length > 0 ? (
                    cardTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="modal-tag"
                        style={{ backgroundColor: tag.color }}
                        onClick={() => this.toggleTag(tag.id)}
                      >
                        {tag.name}
                        <span className="tag-remove">×</span>
                      </span>
                    ))
                  ) : (
                    <span className="no-tags">无标签</span>
                  )}
                </div>
                <div className="picker-wrapper">
                  <button
                    className="picker-toggle"
                    onClick={() =>
                      this.setState({ showLabelPicker: !showLabelPicker })
                    }
                  >
                    选择标签
                  </button>
                  {showLabelPicker && (
                    <div className="picker-dropdown">
                      <div className="picker-header">
                        <span className="picker-title">选择标签</span>
                        <button
                          className="picker-close"
                          onClick={() =>
                            this.setState({ showLabelPicker: false })
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          className={`picker-item ${
                            card.tags?.includes(tag.id) ? "selected" : ""
                          }`}
                          onClick={() => this.toggleTag(tag.id)}
                        >
                          <span
                            className="picker-color"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                <span>负责人</span>
              </h3>
              <div className="section-content">
                <div className="assignee-display">
                  {assignee ? (
                    <span className="assignee-badge">
                      <span
                        className="assignee-avatar"
                        style={{ backgroundColor: "#5e6c84" }}
                      >
                        {assignee.avatar}
                      </span>
                      <span>{assignee.name}</span>
                      <button
                        className="assignee-remove"
                        onClick={() => this.setAssignee(null)}
                      >
                        ×
                      </button>
                    </span>
                  ) : (
                    <span className="no-assignee">未分配</span>
                  )}
                </div>
                <div className="picker-wrapper">
                  <button
                    className="picker-toggle"
                    onClick={() =>
                      this.setState({ showUserPicker: !showUserPicker })
                    }
                  >
                    选择负责人
                  </button>
                  {showUserPicker && (
                    <div className="picker-dropdown">
                      <div className="picker-header">
                        <span className="picker-title">选择负责人</span>
                        <button
                          className="picker-close"
                          onClick={() =>
                            this.setState({ showUserPicker: false })
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                      {users.map((user) => (
                        <button
                          key={user.id}
                          className={`picker-item ${
                            card.assignee === user.id ? "selected" : ""
                          }`}
                          onClick={() => this.setAssignee(user.id)}
                        >
                          <span
                            className="picker-avatar"
                            style={{ backgroundColor: "#5e6c84" }}
                          >
                            {user.avatar}
                          </span>
                          <span>{user.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faFlag} />
                <span>优先级</span>
              </h3>
              <div className="section-content">
                <span
                  className="priority-badge"
                  style={{
                    backgroundColor: `${priority.color}20`,
                    color: priority.color,
                    borderColor: priority.color,
                  }}
                >
                  {priority.label}
                </span>
                <div className="picker-wrapper">
                  <button
                    className="picker-toggle"
                    onClick={() =>
                      this.setState({ showPriorityPicker: !showPriorityPicker })
                    }
                  >
                    更改优先级
                  </button>
                  {showPriorityPicker && (
                    <div className="picker-dropdown">
                      <div className="picker-header">
                        <span className="picker-title">选择优先级</span>
                        <button
                          className="picker-close"
                          onClick={() =>
                            this.setState({ showPriorityPicker: false })
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                      {Object.values(PRIORITIES).map((p) => (
                        <button
                          key={p.value}
                          className={`picker-item ${
                            card.priority === p.value ? "selected" : ""
                          }`}
                          onClick={() => this.setPriority(p.value)}
                        >
                          <span
                            className="picker-dot"
                            style={{ backgroundColor: p.color }}
                          />
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendar} />
                <span>截止日期</span>
              </h3>
              <div className="section-content">
                <input
                  type="date"
                  className="date-input"
                  value={card.dueDate || ""}
                  onChange={(e) =>
                    this.updateCard({ dueDate: e.target.value || null })
                  }
                />
                {card.dueDate && (
                  <span
                    className={`due-status ${
                      isOverdue(card.dueDate) ? "overdue" : ""
                    }`}
                  >
                    {isOverdue(card.dueDate)
                      ? "已逾期"
                      : formatDate(card.dueDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCheckSquare} />
                <span>
                  子任务{" "}
                  {totalSubtasks > 0 &&
                    `(${completedSubtasks}/${totalSubtasks})`}
                </span>
              </h3>
              <div className="section-content">
                <div className="subtask-add">
                  <input
                    type="text"
                    className="subtask-input"
                    placeholder="添加子任务..."
                    value={newSubtaskTitle}
                    onChange={(e) =>
                      this.setState({ newSubtaskTitle: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && this.addSubtask()}
                  />
                  <button className="subtask-add-btn" onClick={this.addSubtask}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="subtask-list">
                  {(card.subtasks || []).map((subtask) => (
                    <div key={subtask.id} className="subtask-item">
                      <label className="subtask-checkbox">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => this.toggleSubtask(subtask.id)}
                        />
                        <span
                          className={`subtask-text ${
                            subtask.completed ? "completed" : ""
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </label>
                      <button
                        className="subtask-delete"
                        onClick={() => this.deleteSubtask(subtask.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faComment} />
                <span>评论 ({(card.comments || []).length})</span>
              </h3>
              <div className="section-content">
                <div className="comment-add">
                  <textarea
                    className="comment-input"
                    placeholder="写评论..."
                    value={newComment}
                    onChange={(e) =>
                      this.setState({ newComment: e.target.value })
                    }
                    rows={2}
                  />
                  <button
                    className="comment-add-btn"
                    onClick={this.addComment}
                    disabled={!newComment.trim()}
                  >
                    发送
                  </button>
                </div>
                <div className="comment-list">
                  {(card.comments || [])
                    .slice()
                    .reverse()
                    .map((comment) => {
                      const commentUser = users.find(
                        (u) => u.id === comment.userId
                      );
                      return (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <span
                              className="comment-avatar"
                              style={{ backgroundColor: "#5e6c84" }}
                            >
                              {commentUser?.avatar || "?"}
                            </span>
                            <span className="comment-author">
                              {commentUser?.name || "未知用户"}
                            </span>
                            <span className="comment-time">
                              {new Date(comment.createdAt).toLocaleString(
                                "zh-CN"
                              )}
                            </span>
                            <button
                              className="comment-delete"
                              onClick={() => this.deleteComment(comment.id)}
                            >
                              ×
                            </button>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn-delete"
              onClick={() => {
                if (window.confirm("确定要删除此卡片吗？")) {
                  const column = this.getCurrentColumn();
                  onDelete(card.id, column?.id);
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>删除卡片</span>
            </button>
            <button className="btn-save" onClick={this.saveAndClose}>
              保存并关闭
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CardModal;
