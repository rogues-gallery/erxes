import * as React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import styled from 'styled-components';

const DayCell = styled.div`
  height: 100px;
  width: 150px;
  position: relative;
`;

class MonthView extends React.Component<{}, {}> {
  renderDay(day) {
    const date = day.getDate();
    console.log(date);
    return <DayCell>{date}</DayCell>;
  }

  render() {
    return (
      <DayPicker
        canChangeMonth={false}
        className="Birthdays"
        renderDay={day => this.renderDay(day)}
      />
    );
  }
}

export default MonthView;
