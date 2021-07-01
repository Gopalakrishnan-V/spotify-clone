import dayjs from 'dayjs';

export const formatDate = date => {
  return dayjs(date).format('MMMM DD, YYYY');
};

export const getYear = date => {
  return dayjs(date).format('YYYY');
};
