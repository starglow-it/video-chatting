/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home', () => {
    it('renders a hello message', () => {
        render(<Home />);

        const helloMessage = screen.getByText('Hello The LiveOffice Team');

        expect(helloMessage).toBeInTheDocument();
    });
});
