import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BudgetInput from './BudgetInput.jsx'

describe('BudgetInput', () => {
  it('renders a field for each budget category', () => {
    render(<BudgetInput />)
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
    expect(screen.getByText('Entertainment')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.getByText('Bills')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('shows the total budget section', () => {
    render(<BudgetInput />)
    expect(screen.getByText(/Total Monthly Budget/i)).toBeInTheDocument()
  })

  it('starts with $0.00 total when localStorage is empty', () => {
    render(<BudgetInput />)
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('updates total when a value is typed', () => {
    render(<BudgetInput />)
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '500' } })
    expect(screen.getByText('$500.00')).toBeInTheDocument()
  })

  it('adds multiple category values into the total', () => {
    render(<BudgetInput />)
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '300' } }) // Food
    fireEvent.change(inputs[1], { target: { value: '200' } }) // Transport
    expect(screen.getByText('$500.00')).toBeInTheDocument()
  })

  it('saves budgets to localStorage when Save is clicked', () => {
    render(<BudgetInput />)
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '400' } })
    fireEvent.click(screen.getByText('Save Budget'))

    const saved = JSON.parse(localStorage.getItem('budget-app:budgets'))
    expect(saved.Food).toBe(400)
  })

  it('shows "Saved!" feedback after clicking Save', async () => {
    render(<BudgetInput />)
    fireEvent.click(screen.getByText('Save Budget'))
    expect(await screen.findByText('✓ Saved!')).toBeInTheDocument()
  })

  it('resets all fields when Reset is clicked', () => {
    render(<BudgetInput />)
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '999' } })
    fireEvent.click(screen.getByText('Reset'))
    // Total should be back to $0.00
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('persists existing budgets from localStorage on mount', () => {
    localStorage.setItem(
      'budget-app:budgets',
      JSON.stringify({ Food: 250, Transport: 100 })
    )
    render(<BudgetInput />)
    expect(screen.getByText('$350.00')).toBeInTheDocument()
  })
})
