import { Details, UserCounter } from 'modules/boards/components/portable';
import { EditForm } from 'modules/boards/containers/editForm';
import { ItemContainer, ItemDate } from 'modules/boards/styles/common';
import {
  Footer,
  PriceContainer,
  Right,
  SpaceContent
} from 'modules/boards/styles/item';
import { Content } from 'modules/boards/styles/stage';
import { IOptions } from 'modules/boards/types';
import { ModalTrigger, Tip } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import moment from 'moment';
import React from 'react';
import { ITicket } from '../types';

type Props = {
  item: ITicket;
  onAdd?: (stageId: string, item: ITicket) => void;
  onRemove?: (dealId: string, stageId: string) => void;
  onUpdate?: (item: ITicket) => void;
  options: IOptions;
};

class Ticket extends React.Component<Props, { isFormVisible: boolean }> {
  renderFormTrigger = (trigger: React.ReactNode) => {
    const { item, onAdd, onRemove, onUpdate, options } = this.props;

    const content = props => (
      <EditForm
        {...props}
        options={options}
        stageId={item.stageId}
        itemId={item._id}
        onAdd={onAdd}
        onRemove={onRemove}
        onUpdate={onUpdate}
      />
    );

    return (
      <ModalTrigger
        title="Edit ticket"
        trigger={trigger}
        size="lg"
        content={content}
      />
    );
  };

  renderDate = (date, format = 'YYYY-MM-DD') => {
    if (!date) {
      return null;
    }

    return (
      <Tip text={moment(date).format(format)}>
        <ItemDate>{moment(date).format('lll')}</ItemDate>
      </Tip>
    );
  };

  render() {
    const { item } = this.props;

    const content = (
      <ItemContainer>
        <Content>
          <SpaceContent>
            <h5>{item.name}</h5>
            {this.renderDate(item.closeDate)}
          </SpaceContent>
          <Details color="#F7CE53" items={item.customers || []} />
          <Details color="#EA475D" items={item.companies || []} />
        </Content>
        <PriceContainer>
          <Right>
            <UserCounter users={item.assignedUsers || []} />
          </Right>
        </PriceContainer>

        <Footer>
          {__('Last updated')}:<Right>{this.renderDate(item.modifiedAt)}</Right>
        </Footer>
      </ItemContainer>
    );

    return this.renderFormTrigger(content);
  }
}

export default Ticket;
