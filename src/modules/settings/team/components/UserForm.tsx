import { UserCommonInfos } from 'modules/auth/components';
import { IUser, IUserDoc } from 'modules/auth/types';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup
} from 'modules/common/components';
import { ColumnTitle, ModalFooter } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import Select from 'react-select-plus';
import { IChannel } from '../../channels/types';

type Props = {
  channels: IChannel[];
  object: IUser;
  save: (
    object: any,
    params: {
      password: string;
      channelIds: string[];
      passwordConfirmation: string;
    } & IUserDoc,
    callback: () => void
  ) => void;
  closeModal: () => void;
};

type State = {
  avatar: string;
  selectedChannels: IChannel[];
};

class UserForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.onAvatarUpload = this.onAvatarUpload.bind(this);
    this.generateChannelsParams = this.generateChannelsParams.bind(this);
    this.collectValues = this.collectValues.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.save = this.save.bind(this);

    const user = props.object || { details: {} };
    const defaultAvatar = '/images/avatar-colored.svg';

    this.state = {
      avatar: user.details.avatar || defaultAvatar,
      selectedChannels: this.generateChannelsParams(props.selectedChannels)
    };
  }

  onAvatarUpload(url) {
    this.setState({ avatar: url });
  }

  generateChannelsParams(channels) {
    return channels.map(channel => ({
      value: channel._id,
      label: channel.name
    }));
  }

  collectValues(items) {
    return items.map(item => item.value);
  }

  renderChannels() {
    const self = this;
    const { channels } = this.props;

    return (
      <FormGroup>
        <ControlLabel>Choose the channels</ControlLabel>
        <br />

        <Select
          placeholder={__('Choose channels')}
          value={self.state.selectedChannels}
          options={self.generateChannelsParams(channels)}
          onChange={items => {
            self.setState({ selectedChannels: items });
          }}
          multi
        />
      </FormGroup>
    );
  }

  getInputElementValue(id) {
    return (document.getElementById(id) as HTMLInputElement).value;
  }

  save(e) {
    e.preventDefault();

    this.props.save(
      this.props.object._id,
      {
        username: this.getInputElementValue('username'),
        email: this.getInputElementValue('email'),
        role: this.getInputElementValue('role'),
        details: {
          avatar: this.state.avatar,
          shortName: this.getInputElementValue('shortName'),
          position: this.getInputElementValue('position'),
          fullName: this.getInputElementValue('fullName'),
          location: this.getInputElementValue('user-location'),
          description: this.getInputElementValue('description')
        },
        channelIds: this.collectValues(this.state.selectedChannels),
        password: this.getInputElementValue('password'),
        passwordConfirmation: this.getInputElementValue(
          'password-confirmation'
        ),
        links: {
          linkedIn: this.getInputElementValue('linkedin'),
          twitter: this.getInputElementValue('twitter'),
          facebook: this.getInputElementValue('facebook'),
          youtube: this.getInputElementValue('youtube'),
          github: this.getInputElementValue('github'),
          website: this.getInputElementValue('website')
        }
      },
      this.props.closeModal
    );
  }

  renderContent() {
    const { object } = this.props;
    const user = object || { details: {} };

    return (
      <div>
        <UserCommonInfos user={user} onAvatarUpload={this.onAvatarUpload} />
        <ColumnTitle>{__('Other')}</ColumnTitle>
        <FormGroup>
          <ControlLabel>Role</ControlLabel>

          <FormControl
            componentClass="select"
            defaultValue={user.role}
            id="role"
          >
            <option value="admin">{__('Admin')}</option>
            <option value="contributor">{__('Contributor')}</option>
          </FormControl>
        </FormGroup>

        {this.renderChannels()}

        <br />

        <FormGroup>
          <ControlLabel>Password</ControlLabel>
          <FormControl id="password" type="password" />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Password confirmation</ControlLabel>
          <FormControl id="password-confirmation" type="password" />
        </FormGroup>
      </div>
    );
  }

  render() {
    const saveButton = (
      <Button btnStyle="success" icon="checked-1">
        Save
      </Button>
    );

    return (
      <form onSubmit={this.save}>
        {this.renderContent()}

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={this.props.closeModal}
            icon="cancel-1"
          >
            Cancel
          </Button>

          <Button btnStyle="success" type="submit" icon="checked-1">
            Save
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default UserForm;
