import { getEnv } from 'apolloClient';
import T from 'i18n-react';
import { IUser, IUserDoc } from 'modules/auth/types';
import React from 'react';
import Alert from './Alert';
import colorParser from './colorParser';
import confirm from './confirmation/confirm';
import router from './router';
import toggleCheckBoxes from './toggleCheckBoxes';
import uploadHandler from './uploadHandler';
import urlParser from './urlParser';

export const renderFullName = data => {
  if (data.firstName || data.lastName) {
    return (data.firstName || '') + ' ' + (data.lastName || '');
  }

  return data.primaryEmail || data.primaryPhone || 'Unknown';
};

export const setTitle = (title: string, force: boolean) => {
  if (!document.title.includes(title) || force) {
    document.title = title;
  }
};

export const setBadge = (count: number, title: string) => {
  const favicon = document.getElementById('favicon') as HTMLAnchorElement;

  if (count) {
    if (document.title.includes(title)) {
      setTitle(`(${count}) ${title}`, true);
    }

    favicon.href = '/favicon-unread.png';
  } else {
    setTitle(title, true);
    favicon.href = '/favicon.png';
  }
};

export const reorder = (
  list: string[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const generateRandomColorCode = () => {
  return `#${Math.random()
    .toString(16)
    .slice(2, 8)}`;
};

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const isTimeStamp = timestamp => {
  const newTimestamp = new Date(timestamp).getTime();
  return isNumeric(newTimestamp);
};

// Create an array with "stop" numbers, starting from "start"
export const range = (start: number, stop: number) => {
  return Array.from(Array(stop), (_, i) => start + i);
};

// Return the list of values that are the intersection of two arrays
export const intersection = (array1: any[], array2: any[]) => {
  return array1.filter(n => array2.includes(n));
};

// Computes the union of the passed-in arrays: the list of unique items
export const union = (array1: any[], array2: any[]) => {
  return array1.concat(array2.filter(n => !array1.includes(n)));
};

// Similar to without, but returns the values from array that are not present in the other arrays.
export const difference = (array1: any[], array2: any[]) => {
  return array1.filter(n => !array2.includes(n));
};

export {
  Alert,
  uploadHandler,
  router,
  confirm,
  toggleCheckBoxes,
  urlParser,
  colorParser
};

export const can = (actionName: string, currentUser: IUser): boolean => {
  if (!currentUser) {
    return false;
  }

  if (currentUser.isOwner) {
    return true;
  }

  if (!actionName) {
    return false;
  }

  const actions = currentUser.permissionActions || [];

  return actions[actionName] === true;
};

export const __ = (key: string, options?: any) => {
  const translation = T.translate(key, options);

  if (!translation) {
    return '';
  }

  return translation.toString();
};

/**
 * Request to get file's URL for view and download
 * @param {String} - value
 * @return {String} - URL
 */
export const readFile = (value: string): string => {
  if (!value || urlParser.isValidURL(value) || value.includes('/')) {
    return value;
  }

  const { REACT_APP_API_URL } = getEnv();

  return `${REACT_APP_API_URL}/read-file?key=${value}`;
};

export const getUserAvatar = (user: IUserDoc) => {
  const { details = {} } = user;

  if (!details.avatar) {
    return '/images/avatar-colored.svg';
  }

  return readFile(details.avatar);
};

export function withProps<IProps>(
  Wrapped: new (props: IProps) => React.Component<IProps>
) {
  return class WithProps extends React.Component<IProps, {}> {
    render() {
      return <Wrapped {...this.props} />;
    }
  };
}

export function renderWithProps<Props>(
  props: Props,
  Wrapped: new (props: Props) => React.Component<Props>
) {
  return <Wrapped {...props} />;
}

export const isValidDate = date => {
  const parsedDate = Date.parse(date);

  // Checking if it is date
  if (isNaN(date) && !isNaN(parsedDate)) {
    return true;
  }

  return false;
};
