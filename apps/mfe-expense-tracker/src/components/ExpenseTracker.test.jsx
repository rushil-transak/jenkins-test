import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ExpenseTracker from './ExpenseTracker.jsx'

describe('ExpenseTracker', () => {
  it('renders the Add Expense form', () => {
    render(<ExpenseTracker />)
    expect(screen.getByText('Add Expense')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount ($)')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
  })

  it('renders category selector with all categories', () => {
    render(<ExpenseTracker />)
    const select = screen.getByLabelText('Category')
    expect(select).toBeInTheDocument()
    expect(select.options.length).toBeGreaterThan(1)
  })

  it('shows empty state when no expenses exist', () => {
    render(<ExpenseTracker />)
    expect(
      screen.getByText(/No expenses yet/i)
    ).toBeInTheDocument()
  })

  it('disables the Add button when amount is empty', () => {
    render(<ExpenseTracker />)
    expect(screen.getByText('+ Add Expense')).toBeDisabled()
  })

  it('enables the Add button when a valid amount is entered', () => {
    render(<ExpenseTracker />)
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '25' },
    })
    expect(screen.getByText('+ Add Expense')).not.toBeDisabled()
  })

  it('adds an expense to the list', () => {
    render(<ExpenseTracker />)
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Lunch with team' },
    })
    fireEvent.click(screen.getByText('+ Add Expense'))

    expect(screen.getByText('Lunch with team')).toBeInTheDocument()
    // Amount appears in the row AND in the total — both are correct
    expect(screen.getAllByText('$50.00').length).toBeGreaterThanOrEqual(1)
  })

  it('clears the form after adding an expense', () => {
    render(<ExpenseTracker />)
    const amountInput = screen.getByLabelText('Amount ($)')
    const descInput = screen.getByLabelText('Description')

    fireEvent.change(amountInput, { target: { value: '30' } })
    fireEvent.change(descInput, { target: { value: 'Coffee' } })
    fireEvent.click(screen.getByText('+ Add Expense'))

    expect(amountInput.value).toBe('')
    expect(descInput.value).toBe('')
  })

  it('saves expense to localStorage', () => {
    render(<ExpenseTracker />)
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '75' },
    })
    fireEvent.click(screen.getByText('+ Add Expense'))

    const saved = JSON.parse(localStorage.getItem('budget-app:expenses'))
    expect(saved).toHaveLength(1)
    expect(saved[0].amount).toBe(75)
  })

  it('deletes an expense when the × button is clicked', () => {
    render(<ExpenseTracker />)
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '20' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Taxi' },
    })
    fireEvent.click(screen.getByText('+ Add Expense'))

    expect(screen.getByText('Taxi')).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Delete expense'))
    expect(screen.queryByText('Taxi')).not.toBeInTheDocument()
  })

  it('loads existing expenses from localStorage on mount', () => {
    localStorage.setItem(
      'budget-app:expenses',
      JSON.stringify([
        {
          id: '1',
          category: 'Food',
          amount: 99,
          description: 'Groceries',
          date: '2026-04-15',
        },
      ])
    )
    render(<ExpenseTracker />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    // Amount appears in the row and in the total row
    expect(screen.getAllByText('$99.00').length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct total for filtered expenses', () => {
    localStorage.setItem(
      'budget-app:expenses',
      JSON.stringify([
        { id: '1', category: 'Food', amount: 100, description: 'A', date: '2026-04-15' },
        { id: '2', category: 'Transport', amount: 50, description: 'B', date: '2026-04-15' },
      ])
    )
    render(<ExpenseTracker />)
    // Default filter is All — total should be 150
    expect(screen.getByText('$150.00')).toBeInTheDocument()
  })
})
