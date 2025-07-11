import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import Avatar from '@mui/material/Avatar';
import { action } from 'storybook/actions';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'MUI/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'The content of the chip.' },
    variant: {
      control: { type: 'radio' },
      options: ['filled', 'outlined'],
      description: 'The variant to use.',
    },
    color: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'The color of the component.',
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium'],
      description: 'The size of the component.',
    },
  },
  args: {
    label: 'Chip',
    variant: 'filled',
    color: 'primary',
    size: 'medium',
  },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Clickable: Story = {
  args: {
    label: 'Clickable',
    onClick: action('clicked'),
  },
};

export const Deletable: Story = {
  args: {
    label: 'Deletable',
    onDelete: action('deleted'),
  },
};

export const ClickableDeletable: Story = {
  args: {
    label: 'Clickable Deletable',
    onClick: action('clicked'),
    onDelete: action('deleted'),
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FaceIcon />,
    label: 'With Icon',
  },
};

export const WithAvatar: Story = {
  args: {
    avatar: <Avatar>M</Avatar>,
    label: 'With Avatar',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: 'Success',
    color: 'success',
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    color: 'error',
  },
};

export const Info: Story = {
  args: {
    label: 'Info',
    color: 'info',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    color: 'warning',
  },
};

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium',
    size: 'medium',
  },
};
