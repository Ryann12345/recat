import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faTimes,
  faUser,
  faTag,
  faFlag,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { PRIORITIES } from "../utils/constants";

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilters: false,
    };
  }

  hasActiveFilters = () => {
    const { filters } = this.props;
    return (
      filters.assignee || filters.priority || filters.tag || filters.overdue
    );
  };

  clearAllFilters = () => {
    this.props.onFilterChange({
      assignee: null,
      priority: null,
      tag: null,
      overdue: false,
    });
  };

  render() {
    const {
      searchQuery,
      filters,
      users,
      tags,
      onSearchChange,
      onFilterChange,
    } = this.props;
    const { showFilters } = this.state;

    const selectedAssignee = users.find((u) => u.id === filters.assignee);
    const selectedTag = tags.find((t) => t.id === filters.tag);
    const selectedPriority = Object.values(PRIORITIES).find(
      (p) => p.value === filters.priority
    );

    return (
      <div className="search-filter">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="搜索卡片..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange("")}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <button
          className={`filter-toggle ${this.hasActiveFilters() ? "active" : ""}`}
          onClick={() => this.setState({ showFilters: !showFilters })}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>筛选</span>
          {this.hasActiveFilters() && <span className="filter-badge">!</span>}
        </button>

        {showFilters && (
          <div className="filter-dropdown">
            <div className="filter-section">
              <label className="filter-label">
                <FontAwesomeIcon icon={faUser} />
                <span>负责人</span>
              </label>
              <select
                className="filter-select"
                value={filters.assignee || ""}
                onChange={(e) =>
                  onFilterChange({ assignee: e.target.value || null })
                }
              >
                <option value="">全部</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">
                <FontAwesomeIcon icon={faFlag} />
                <span>优先级</span>
              </label>
              <select
                className="filter-select"
                value={filters.priority || ""}
                onChange={(e) =>
                  onFilterChange({ priority: e.target.value || null })
                }
              >
                <option value="">全部</option>
                {Object.values(PRIORITIES).map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">
                <FontAwesomeIcon icon={faTag} />
                <span>标签</span>
              </label>
              <select
                className="filter-select"
                value={filters.tag || ""}
                onChange={(e) =>
                  onFilterChange({ tag: e.target.value || null })
                }
              >
                <option value="">全部</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section checkbox">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={(e) =>
                    onFilterChange({ overdue: e.target.checked })
                  }
                />
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span>仅显示逾期</span>
              </label>
            </div>

            {this.hasActiveFilters() && (
              <button
                className="clear-filters-btn"
                onClick={this.clearAllFilters}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>清除所有筛选</span>
              </button>
            )}
          </div>
        )}

        {this.hasActiveFilters() && (
          <div className="active-filters">
            {selectedAssignee && (
              <span className="active-filter">
                <span className="filter-name">负责人:</span>
                <span className="filter-value">{selectedAssignee.name}</span>
                <button
                  className="filter-remove"
                  onClick={() => onFilterChange({ assignee: null })}
                >
                  ×
                </button>
              </span>
            )}
            {selectedPriority && (
              <span className="active-filter">
                <span className="filter-name">优先级:</span>
                <span className="filter-value">{selectedPriority.label}</span>
                <button
                  className="filter-remove"
                  onClick={() => onFilterChange({ priority: null })}
                >
                  ×
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="active-filter">
                <span className="filter-name">标签:</span>
                <span className="filter-value">{selectedTag.name}</span>
                <button
                  className="filter-remove"
                  onClick={() => onFilterChange({ tag: null })}
                >
                  ×
                </button>
              </span>
            )}
            {filters.overdue && (
              <span className="active-filter">
                <span className="filter-value">仅逾期</span>
                <button
                  className="filter-remove"
                  onClick={() => onFilterChange({ overdue: false })}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SearchFilter;
