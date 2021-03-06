import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Info
} from 'modules/common/components';
import { ModalFooter } from 'modules/common/styles/main';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __, Alert } from 'modules/common/utils';
import { ICommonFormProps } from 'modules/settings/common/types';
import { IUserGroup } from 'modules/settings/permissions/types';
import React from 'react';
import { Description } from '../../styles';
import { FlexRow, InviteOption, LinkButton, RemoveRow } from '../styles';
import { IInvitationEntry } from '../types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  usersGroups: IUserGroup[];
  refetchQueries: any;
} & ICommonFormProps;

type State = {
  entries: IInvitationEntry[];
  addMany: boolean;
  isSubmitted: boolean;
};

class UserInvitationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      entries: [
        { email: '', groupId: '' },
        { email: '', groupId: '' },
        { email: '', groupId: '' }
      ],
      addMany: false,
      isSubmitted: false
    };
  }

  generateDoc = () => {
    const { entries } = this.state;

    const validEntries: IInvitationEntry[] = [];

    for (const entry of entries) {
      if (entry.email && entry.groupId) {
        validEntries.push(entry);
      }
    }

    return { entries: validEntries };
  };

  onChange = (i: number, type: 'email' | 'groupId', e: React.FormEvent) => {
    const { value } = e.target as HTMLInputElement;

    const entries = [...this.state.entries];

    entries[i] = { ...entries[i], [type]: value };

    this.setState({ entries });
  };

  onAddMoreInput = () => {
    this.setState({
      entries: [...this.state.entries, { email: '', groupId: '' }]
    });
  };

  onAddManyEmail = () => {
    this.setState({ addMany: true });
  };

  addInvitees = () => {
    const { entries } = this.state;

    const values = (document.getElementById(
      'multipleEmailValue'
    ) as HTMLInputElement).value;

    if (!values) {
      return Alert.warning('No email address found!');
    }

    const emails = values.split(',');

    emails.map(e => entries.splice(0, 0, { email: e, groupId: '' }));

    this.setState({ addMany: false });
  };

  handleRemoveEntry = (i: number) => {
    const { entries } = this.state;

    this.setState({ entries: entries.filter((item, index) => index !== i) });
  };

  renderRemoveInput = (i: number) => {
    const { entries } = this.state;

    if (entries.length <= 1) {
      return null;
    }

    return (
      <RemoveRow onClick={this.handleRemoveEntry.bind(this, i)}>
        <Icon icon="cancel" />
      </RemoveRow>
    );
  };

  renderMultipleEmail() {
    const onCancel = () => this.setState({ addMany: false });

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>
            Enter multiple email addresses
          </ControlLabel>
          <Description>
            {__('Please separate each email address with comma.')}
          </Description>
          <FormControl
            id="multipleEmailValue"
            componentClass="textarea"
            rows={5}
            required={true}
          />
        </FormGroup>
        <ModalFooter>
          <Button btnStyle="simple" onClick={onCancel} icon="cancel-1">
            Cancel
          </Button>

          <Button
            btnStyle="success"
            icon="checked-1"
            onClick={this.addInvitees}
          >
            Add Invites
          </Button>
        </ModalFooter>
      </>
    );
  }

  generateGroupsChoices = () => {
    return this.props.usersGroups.map(group => ({
      value: group._id,
      label: group.name
    }));
  };

  renderContent = (formProps: IFormProps) => {
    const { addMany, entries } = this.state;
    const { closeModal, renderButton } = this.props;
    const { isSubmitted } = formProps;

    if (addMany) {
      return this.renderMultipleEmail();
    }

    return (
      <>
        <FlexRow>
          <ControlLabel required={true}>Email address</ControlLabel>
          <ControlLabel required={true}>Permission</ControlLabel>
        </FlexRow>

        {entries.map((input, i) => (
          <FlexRow key={i}>
            <FormControl
              {...formProps}
              name="email"
              type="email"
              placeholder="name@example.com"
              value={input.email}
              autoFocus={i === 0}
              onChange={this.onChange.bind(this, i, 'email')}
              required={true}
            />

            <FormControl
              {...formProps}
              name="groupId"
              componentClass="select"
              placeholder={__('Choose group')}
              options={[
                { value: '', label: '' },
                ...this.generateGroupsChoices()
              ]}
              onChange={this.onChange.bind(this, i, 'groupId')}
              required={true}
            />

            {this.renderRemoveInput(i)}
          </FlexRow>
        ))}

        <InviteOption>
          <LinkButton onClick={this.onAddMoreInput}>
            <Icon icon="add" /> {__('Add another')}
          </LinkButton>{' '}
          {__('or')}{' '}
          <LinkButton onClick={this.onAddManyEmail}>
            {__('add many at once')}{' '}
          </LinkButton>
        </InviteOption>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Cancel
          </Button>

          {renderButton({
            name: 'team member invitation',
            values: this.generateDoc(),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return (
      <>
        <Info>
          {__("Send an email and notify members that they've been invited!")}
        </Info>

        <Form renderContent={this.renderContent} />
      </>
    );
  }
}

export default UserInvitationForm;
