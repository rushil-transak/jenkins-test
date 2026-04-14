import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App.jsx'

// Remote MFE imports are resolved to local mock components via
// the aliases defined in vitest.config.js — no live remotes needed.

describe('Shell App', () => {
  it('renders the app header', () => {
    render(<App />)
    expect(screen.getByText('Budget Calculator')).toBeInTheDocument()
  })

  it('renders all navigation tabs', () => {
    render(<App />)
    // Use role=button to avoid matching the header chip that also says "Expenses"
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Budget Setup/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Expenses/i })).toBeInTheDocument()
  })

  it('shows the Summary MFE on initial load (Dashboard tab)', async () => {
    render(<App />)
    await waitFor(() =>
      expect(screen.getByTestId('mfe-summary')).toBeInTheDocument()
    )
  })

  it('switches to Budget Input MFE when Budget Setup tab is clicked', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Budget Setup'))
    await waitFor(() =>
      expect(screen.getByTestId('mfe-budget-input')).toBeInTheDocument()
    )
  })

  it('switches to Expense Tracker MFE when Expenses tab is clicked', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Expenses/i }))
    await waitFor(() =>
      expect(screen.getByTestId('mfe-expense-tracker')).toBeInTheDocument()
    )
  })

  it('only renders one MFE at a time', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Budget Setup/i }))
    await waitFor(() =>
      expect(screen.getByTestId('mfe-budget-input')).toBeInTheDocument()
    )
    expect(screen.queryByTestId('mfe-summary')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mfe-expense-tracker')).not.toBeInTheDocument()
  })

  it('active tab is visually highlighted', () => {
    render(<App />)
    const dashboardTab = screen.getByRole('button', { name: /Dashboard/i })
    const budgetTab = screen.getByRole('button', { name: /Budget Setup/i })

    // Dashboard is active by default — has a heavier font weight
    expect(dashboardTab).toHaveStyle({ fontWeight: '600' })
    expect(budgetTab).toHaveStyle({ fontWeight: '400' })
  })
})
