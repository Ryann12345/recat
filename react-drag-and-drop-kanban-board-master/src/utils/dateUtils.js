import {
  format,
  isBefore,
  isToday,
  parseISO,
  differenceInDays,
} from "date-fns";

export const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = parseISO(dateString);
  if (isToday(date)) {
    return "今天";
  }
  const daysDiff = differenceInDays(date, new Date());
  if (daysDiff === 1) {
    return "明天";
  }
  if (daysDiff === -1) {
    return "昨天";
  }
  return format(date, "MM月dd日");
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return isBefore(parseISO(dueDate), new Date()) && !isToday(parseISO(dueDate));
};

export const isTodayOrOverdue = (dueDate) => {
  if (!dueDate) return false;
  return isBefore(parseISO(dueDate), new Date()) || isToday(parseISO(dueDate));
};

export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  if (isOverdue(dueDate)) return "overdue";
  if (isToday(parseISO(dueDate))) return "today";
  const daysDiff = differenceInDays(parseISO(dueDate), new Date());
  if (daysDiff <= 3) return "soon";
  return "normal";
};
