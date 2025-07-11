import type { Meta, StoryObj } from '@storybook/react-vite';
import Save from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import MuiIconButton from '@mui/material/IconButton';

const meta = {
  title: 'MUI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
        'inherit',
      ],
    },
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text',
  },
};

export const WithStartIcon: Story = {
  render: (args) => (
    <Button {...args} startIcon={<Save />}>
      Save
    </Button>
  ),
};

export const WithEndIcon: Story = {
  render: (args) => (
    <Button {...args} endIcon={<Save />}>
      Save
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Loading: Story = {
  render: (args) => (
    <Button {...args} disabled>
      <CircularProgress size={20} sx={{ mr: 1 }} />
      Loading
    </Button>
  ),
};

export const Focused: Story = {
  args: {
    children: 'Focused',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) button.focus();
  },
};

export const Active: Story = {
  args: {
    children: 'Active',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.focus();
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  },
};

export const Hover: Story = {
  args: {
    children: 'Hover',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    children: 'Secondary',
  },
};

export const Error: Story = {
  args: {
    color: 'error',
    children: 'Error',
  },
};

export const Info: Story = {
  args: {
    color: 'info',
    children: 'Info',
  },
};

export const Success: Story = {
  args: {
    color: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    color: 'warning',
    children: 'Warning',
  },
};

export const Inherit: Story = {
  args: {
    color: 'inherit',
    children: 'Inherit',
  },
};

export const IconButton: Story = {
  render: (args) => (
    <MuiIconButton {...args}>
      <Save />
    </MuiIconButton>
  ),
};
