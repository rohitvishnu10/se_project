import { render, screen, fireEvent } from '@testing-library/react';
import MeetingRoom from '../components/MeetingRoom';
import { useMeetingContext } from '@/context/MeetingContext';

// Mock the useMeetingContext hook
jest.mock('@/context/MeetingContext');

describe('MeetingRoom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test

    useMeetingContext.mockReturnValue({
      meetingName: 'Team Sync',
      participants: [
        { name: 'Alice', userId: '1', roles: ['host'], joinedAt: new Date() },
        { name: 'Bob', userId: '2', roles: ['participant'], joinedAt: new Date() }
      ],
      isLoading: false,
    });
  });

  test('renders meeting name correctly', () => {
    render(<MeetingRoom />);
    expect(screen.getByText('Team Sync')).toBeInTheDocument();
  });

  test('renders participant names correctly', () => {
    render(<MeetingRoom />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  describe('when data is loading', () => {
    beforeEach(() => {
      useMeetingContext.mockReturnValue({ isLoading: true });
    });

    test('shows loading state', () => {
      render(<MeetingRoom />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  test('calls downloadParticipantsList when download button is clicked', () => {
    // Mock console.log to suppress debug output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<MeetingRoom />);
    
    // Find the button by text and simulate a click
    const button = screen.getByRole('button', { name: /download participants/i });
    fireEvent.click(button);

    // Check if console.log was triggered (indicating the function ran)
    expect(console.log).toHaveBeenCalledWith('Download button clicked');

    // Restore console.log after test
    console.log.mockRestore();
  });
});
