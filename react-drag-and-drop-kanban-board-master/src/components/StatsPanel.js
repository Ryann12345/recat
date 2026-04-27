import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faExclamationTriangle,
  faCheckCircle,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { isOverdue } from "../utils/dateUtils";

class StatsPanel extends Component {
  render() {
    const { stats, columns, cards } = this.props;

    const getColumnOverdueCount = (column) => {
      return column.cardIds.filter((cardId) => {
        const card = cards[cardId];
        return card && isOverdue(card.dueDate);
      }).length;
    };

    return (
      <div className="stats-panel">
        <div className="stats-header">
          <h2 className="stats-title">
            <FontAwesomeIcon icon={faChartBar} />
            <span>统计面板</span>
          </h2>
        </div>

        <div className="stats-content">
          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-icon total">
                <FontAwesomeIcon icon={faTasks} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalCards}</span>
                <span className="stat-label">总卡片数</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.completedCards}</span>
                <span className="stat-label">已完成</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon overdue">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.overdueCards}</span>
                <span className="stat-label">已逾期</span>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3 className="stats-section-title">完成率</h3>
            <div className="completion-rate">
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="completion-text">{stats.completionRate}%</span>
            </div>
          </div>

          <div className="stats-section">
            <h3 className="stats-section-title">各列分布</h3>
            <div className="column-stats">
              {columns.map((column) => {
                const count = column.cardIds.length;
                const overdueCount = getColumnOverdueCount(column);
                const percentage =
                  stats.totalCards > 0
                    ? Math.round((count / stats.totalCards) * 100)
                    : 0;

                return (
                  <div key={column.id} className="column-stat-item">
                    <div className="column-stat-header">
                      <span className="column-stat-name">{column.title}</span>
                      <span className="column-stat-count">
                        {count} 张
                        {overdueCount > 0 && (
                          <span className="column-stat-overdue">
                            ({overdueCount} 逾期)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="column-stat-bar-container">
                      <div
                        className="column-stat-bar"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="column-stat-percentage">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stats-section">
            <h3 className="stats-section-title">卡片详情</h3>
            <div className="stats-detail">
              <div className="detail-item">
                <span className="detail-label">待处理</span>
                <span className="detail-value">
                  {columns.find((c) => c.title === "待办")?.cardIds.length || 0}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">进行中</span>
                <span className="detail-value">
                  {columns.find((c) => c.title === "进行中")?.cardIds.length ||
                    0}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">已完成</span>
                <span className="detail-value">{stats.completedCards}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">逾期率</span>
                <span className="detail-value">
                  {stats.totalCards > 0
                    ? Math.round((stats.overdueCards / stats.totalCards) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsPanel;
