import { Button, EmptyState } from 'modules/common/components';
import { __, Alert } from 'modules/common/utils';
import { Sidebar } from 'modules/layout/components';
import React from 'react';
import { SidebarContent } from '../styles';
import { IFieldGroup } from '../types';
import GenerateField from './GenerateField';

type Props = {
  fieldGroup: IFieldGroup;
  loading?: boolean;
  data: any;
  save: (data: any, callback: (error: Error) => void) => void;
};

type State = {
  editing: boolean;
  data: any;
};

class GenerateGroup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      data: props.data
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.data !== nextProps.data) {
      this.setState({ data: nextProps.data });
    }
  }

  save = () => {
    const { data } = this.state;
    const { save } = this.props;

    save(data, error => {
      if (error) {
        return Alert.error(error.message);
      }

      this.cancelEditing();

      return Alert.success('Success');
    });
  };

  toggleEditing = () => {
    this.setState({ editing: true });
  };

  cancelEditing = () => {
    this.setState({
      editing: false
    });
  };

  onChange = ({ _id, value }) => {
    const { data } = this.state;

    this.setState({ data: { ...data, [_id]: value } });
    this.toggleEditing();
  };

  renderButtons() {
    if (!this.state.editing) {
      return null;
    }

    return (
      <Sidebar.Footer>
        <Button
          btnStyle="simple"
          size="small"
          onClick={this.cancelEditing}
          icon="cancel-1"
        >
          Discard
        </Button>
        <Button
          btnStyle="success"
          size="small"
          onClick={this.save}
          icon="checked-1"
        >
          Save
        </Button>
      </Sidebar.Footer>
    );
  }

  onValueChange = ({ _id, value }) => {
    return this.onChange({ _id, value });
  };

  renderContent() {
    const { fieldGroup } = this.props;
    const { data } = this.state;

    if (fieldGroup.fields.length === 0) {
      return <EmptyState icon="folder" text="Empty" size="small" />;
    }

    return (
      <SidebarContent>
        {fieldGroup.fields.map((field, index) => {
          if (!field.isVisible) {
            return null;
          }

          return (
            <GenerateField
              field={field}
              key={index}
              onValueChange={this.onValueChange}
              defaultValue={data[field._id] || ''}
            />
          );
        })}
      </SidebarContent>
    );
  }

  render() {
    const { Section } = Sidebar;
    const { Title } = Section;

    const { fieldGroup } = this.props;

    if (!fieldGroup.isVisible) {
      return null;
    }

    return (
      <Section>
        <Title>{fieldGroup.name}</Title>

        {this.renderContent()}
        {this.renderButtons()}
      </Section>
    );
  }
}

type GroupsProps = {
  fieldsGroups: IFieldGroup[];
  customFieldsData: any;
  loading?: boolean;
  save: (data: { customFieldsData: any }, callback: () => any) => void;
};

class GenerateGroups extends React.Component<GroupsProps> {
  saveGroup = (groupData, callback) => {
    const { customFieldsData, save } = this.props;

    const updatedData = {
      ...(customFieldsData || {}),
      ...(groupData || {})
    };

    save({ customFieldsData: updatedData }, callback);
  };

  render() {
    const { loading, fieldsGroups, customFieldsData } = this.props;
    const { Section } = Sidebar;
    const { Title } = Section;

    if (fieldsGroups.length === 0) {
      return (
        <Section>
          <Title>{__('Contact information')}</Title>
          <EmptyState icon="folder" text="Empty" size="small" />
        </Section>
      );
    }

    return fieldsGroups.map(fieldGroup => {
      const data = {};

      for (const field of fieldGroup.fields) {
        data[field._id] = customFieldsData[field._id];
      }

      return (
        <GenerateGroup
          key={fieldGroup._id}
          loading={loading}
          data={data}
          fieldGroup={fieldGroup}
          save={this.saveGroup}
        />
      );
    });
  }
}

export default GenerateGroups;
