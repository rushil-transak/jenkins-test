import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Summary from './Summary.jsx'

const setBudgets = (data) =>
  localStorage.setItem('budget-app:budgets', JSON.stringify(data))

const setExpenses = (data) =>
  localStorage.setItem('budget-app:expenses', JSON.stringify(data))

describe('Summary', () => {
  it('shows empty state when there is no budget or expense data', () => {
    render(<Summary />)
    expect(screen.getByText(/No data yet/i)).toBeInTheDocument()
  })

  it('displays the TOTAL BUDGET label when budgets are set', () => {
    setBudgets({ Food: 500, Transport: 200 })
    render(<Summary />)
    expect(screen.getByText('TOTAL BUDGET')).toBeInTheDocument()
    // Verify $700.00 appears somewhere (may appear in multiple places)
    expect(screen.getAllByText('$700.00').length).toBeGreaterThanOrEqual(1)
  })

  it('displays transaction count when expenses exist', () => {
    setBudgets({ Food: 500 })
    setExpenses([
      { id: '1', category: 'Food', amount: 150, description: 'Groceries', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('TOTAL SPENT')).toBeInTheDocument()
    expect(screen.getByText('1 transaction')).toBeInTheDocument()
  })

  it('shows remaining amount and headroom when under budget', () => {
    setBudgets({ Food: 500 })
    setExpenses([
      { id: '1', category: 'Food', amount: 200, description: 'Groceries', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('REMAINING')).toBeInTheDocument()
    // 200/500 = 40% spent → 60% headroom
    expect(screen.getByText('60% headroom')).toBeInTheDocument()
  })

  it('shows over budget status when expenses exceed budget', () => {
    setBudgets({ Food: 100 })
    setExpenses([
      { id: '1', category: 'Food', amount: 200, description: 'Splurge', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('OVER BUDGET')).toBeInTheDocument()
    expect(screen.getByText('exceeded limit')).toBeInTheDocument()
  })

  it('renders overall usage progress bar section', () => {
    setBudgets({ Food: 400 })
    setExpenses([
      { id: '1', category: 'Food', amount: 100, description: 'x', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('Overall Usage')).toBeInTheDocument()
  })

  it('renders per-category breakdown for active categories', () => {
    setBudgets({ Food: 400, Transport: 200 })
    setExpenses([
      { id: '1', category: 'Food', amount: 100, description: 'x', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
  })

  it('shows categories that have expenses even without a set budget', () => {
    setExpenses([
      { id: '1', category: 'Shopping', amount: 50, description: 'Shoes', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.getByText('no budget set')).toBeInTheDocument()
  })

  it('shows "over budget!" label when a category is over its limit', () => {
    setBudgets({ Food: 100 })
    setExpenses([
      { id: '1', category: 'Food', amount: 200, description: 'x', date: '2026-04-15' },
    ])
    render(<Summary />)
    expect(screen.getByText('over budget!')).toBeInTheDocument()
  })

  it('updates when budget-app:budgets-updated event fires', () => {
    render(<Summary />)
    expect(screen.getByText(/No data yet/i)).toBeInTheDocument()

    act(() => {
      window.dispatchEvent(
        new CustomEvent('budget-app:budgets-updated', {
          detail: { Food: 600 },
        })
      )
    })

    expect(screen.getByText('TOTAL BUDGET')).toBeInTheDocument()
    expect(screen.getAllByText('$600.00').length).toBeGreaterThanOrEqual(1)
  })

  it('updates when budget-app:expenses-updated event fires', () => {
    setBudgets({ Food: 500 })
    render(<Summary />)

    act(() => {
      window.dispatchEvent(
        new CustomEvent('budget-app:expenses-updated', {
          detail: [
            { id: '1', category: 'Food', amount: 300, description: 'x', date: '2026-04-15' },
          ],
        })
      )
    })

    expect(screen.getByText('1 transaction')).toBeInTheDocument()
    expect(screen.getByText('40% headroom')).toBeInTheDocument()
  })
})
