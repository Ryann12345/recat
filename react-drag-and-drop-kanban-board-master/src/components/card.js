import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendar,
  faCheckSquare,
  faComment,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { PRIORITIES } from "../utils/constants";
import { formatDate, getDueDateStatus, isOverdue } from "../utils/dateUtils";

class Card extends Component {
  render() {
    const { card, users, tags, onClick } = this.props;
    const assignee = users.find((u) => u.id === card.assignee);
    const cardTags = card.tags
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter(Boolean);
    const completedSubtasks = (card.subtasks || []).filter((s) => s.completed)
      .length;
    const totalSubtasks = (card.subtasks || []).length;
    const commentCount = (card.comments || []).length;
    const priority =
      PRIORITIES[card.priority?.toUpperCase()] || PRIORITIES.MEDIUM;
    const dueDateStatus = card.dueDate ? getDueDateStatus(card.dueDate) : null;

    return (
      <div className="card" onClick={onClick}>
        {cardTags.length > 0 && (
          <div className="card-tags">
            {cardTags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="card-tag"
                style={{ backgroundColor: tag.color }}
                title={tag.name}
              />
            ))}
            {cardTags.length > 3 && (
              <span
                className="card-tag-more"
                title={`还有 ${cardTags.length - 3} 个标签`}
              >
                +{cardTags.length - 3}
              </span>
            )}
          </div>
        )}

        <h4 className="card-title">{card.title || "未命名卡片"}</h4>

        {card.description && (
          <p className="card-description">
            {card.description.substring(0, 100)}
            {card.description.length > 100 ? "..." : ""}
          </p>
        )}

        <div className="card-meta">
          <div className="card-meta-left">
            {card.priority && (
              <span
                className="card-priority"
                style={{
                  backgroundColor: `${priority.color}20`,
                  color: priority.color,
                  borderColor: priority.color,
                }}
              >
                {priority.label}
              </span>
            )}
          </div>

          <div className="card-meta-right">
            {totalSubtasks > 0 && (
              <span className="card-subtask">
                <FontAwesomeIcon icon={faCheckSquare} />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </span>
            )}

            {commentCount > 0 && (
              <span className="card-comment">
                <FontAwesomeIcon icon={faComment} />
                <span>{commentCount}</span>
              </span>
            )}

            {card.dueDate && (
              <span
                className={`card-due ${dueDateStatus}`}
                title={isOverdue(card.dueDate) ? "已逾期" : "截止日期"}
              >
                <FontAwesomeIcon icon={faCalendar} />
                <span>{formatDate(card.dueDate)}</span>
              </span>
            )}

            {assignee && (
              <span
                className="card-assignee"
                title={assignee.name}
                style={{ backgroundColor: "#5e6c84" }}
              >
                {assignee.avatar}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
