import React from 'react';
import { render, screen } from '@testing-library/react';
import MeetingRoom from './MeetingRoom';

describe('MeetingRoom Component', () => {
    test('renders MeetingRoom component', () => {
        render(<MeetingRoom />);
        const linkElement = screen.getByText(/Meeting Room/i);
        expect(linkElement).toBeInTheDocument();
    });
});
