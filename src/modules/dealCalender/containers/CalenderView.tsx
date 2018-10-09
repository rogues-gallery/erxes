import * as React from 'react';
import { CalenderView } from '../components';

type Props = {
  queryParams: string;
};

const CalenderViewContainer = (props: Props) => {
  const updatedProps = {
    ...props
  };

  console.log('FKN CONTAINER CALENDER VIEW');

  return <CalenderView {...updatedProps} />;
};

export default CalenderViewContainer;
