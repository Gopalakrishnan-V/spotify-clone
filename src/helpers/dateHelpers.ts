import dayjs from 'dayjs';

export const formatDate = (date: string) => {
  return dayjs(date).format('MMMM DD, YYYY');
};

export const getYear = (date: string) => {
  return dayjs(date).format('YYYY');
};
