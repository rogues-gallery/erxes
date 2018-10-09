import { router } from 'modules/common/utils';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { withRouter } from 'react-router';
import Select from 'react-select-plus';
import { Icon } from '../../common/components';
import { IRouterProps } from '../../common/types';
import { Wrapper } from '../../layout/components';
import { BarItems } from '../../layout/styles';
import { DATE_FILTER_TYPES } from '../constant';
import MonthView from './filteredViews/MonthView';

interface IProps extends IRouterProps {
  queryParams: any;
}

class CalenderView extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);

    this.renderContent = this.renderContent.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  renderContent() {
    const { queryParams } = this.props;

    if (queryParams.type && queryParams.type === 'week') {
      return <MonthView />;
    }

    if (queryParams.type && queryParams.type === 'year') {
      return (
        <DayPicker
          numberOfMonths={12}
          month={new Date(2018, 0)}
          canChangeMonth={false}
          pagedNavigation
          fixedWeeks
        />
      );
    }

    return null;
  }

  renderLeftSideBar() {
    return <DayPicker fixedWeeks />;
  }

  renderActionBarLeft() {
    return (
      <BarItems>
        <Icon icon="icon-leftarrow" />
        <Icon icon="icon-rightarrow" />
      </BarItems>
    );
  }

  renderActionBarRight() {
    return (
      <BarItems>
        <Select
          placeholder="Type"
          onChange={this.onTypeChange}
          options={DATE_FILTER_TYPES}
        />
      </BarItems>
    );
  }

  renderActionBar() {
    return (
      <Wrapper.ActionBar
        left={this.renderActionBarLeft()}
        right={this.renderActionBarRight()}
      />
    );
  }

  onTypeChange(selectedOption) {
    const { history } = this.props;

    router.setParams(history, { type: selectedOption.value });
  }

  render() {
    const breadcrumb = [{ title: `Testing` }];
    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        actionBar={this.renderActionBar()}
        leftSidebar={this.renderLeftSideBar()}
        content={this.renderContent()}
      />
    );
  }
}

export default withRouter<IProps>(CalenderView);
