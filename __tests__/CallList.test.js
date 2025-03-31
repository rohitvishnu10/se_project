import { render, screen } from '@testing-library/react';
import CallList from '../components/CallList';
import { useGetCalls } from '@/hooks/useGetCalls';
import { useRouter } from 'next/navigation';

jest.mock('@/hooks/useGetCalls');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('CallList Component', () => {
  beforeEach(() => {
    useGetCalls.mockReturnValue({
      endedCalls: [{ id: '1', name: 'Ended Call 1' }],
      upcomingCalls: [{ id: '2', name: 'Upcoming Call 1' }],
      callRecordings: [{ id: '3', name: 'Recording 1' }],
      isLoading: false,
    });
  });

  test('renders ended calls correctly', async () => {
    render(<CallList type="ended" />);
    expect(await screen.findByText('Ended Call 1')).toBeInTheDocument();
  });

  test('renders upcoming calls correctly', async () => {
    render(<CallList type="upcoming" />);
    expect(await screen.findByText('Upcoming Call 1')).toBeInTheDocument();
  });

  test('renders call recordings correctly', async () => {
    render(<CallList type="recordings" />);
    expect(await screen.findByText('Recording 1')).toBeInTheDocument();
  });
});

// Separate MeetingRoom tests into a new file if needed
import MeetingRoom from '../components/MeetingRoom';
import { useMeetingContext } from '@/context/MeetingContext';

jest.mock('@/context/MeetingContext');

describe('MeetingRoom Component', () => {
  beforeEach(() => {
    useMeetingContext.mockReturnValue({
      meetingName: 'Team Sync',
      participants: ['Alice', 'Bob'],
      isLoading: false,
    });
  });

  test('renders meeting name correctly', async () => {
    render(<MeetingRoom />);
    expect(await screen.findByText('Team Sync')).toBeInTheDocument();
  });

  test('renders participant names correctly', async () => {
    render(<MeetingRoom />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(await screen.findByText('Bob')).toBeInTheDocument();
  });

  test('shows loading state when data is being fetched', async () => {
    useMeetingContext.mockReturnValue({ isLoading: true });
    render(<MeetingRoom />);
    expect(await screen.findByText('Loading...')).toBeInTheDocument();
  });
});
