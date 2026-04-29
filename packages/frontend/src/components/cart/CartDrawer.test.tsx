import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CartDrawer } from './CartDrawer';
import { CartProvider } from '../../contexts/CartContext';

function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>,
  );
}

describe('CartDrawer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exibe mensagem de carrinho vazio quando aberto', () => {
    renderWithProviders(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Sua sacola está vazia')).toBeInTheDocument();
  });

  it('exibe titulo com contagem de itens', () => {
    localStorage.setItem(
      'burguerhouse_cart',
      JSON.stringify([
        { id: 1, name: 'X-Burguer', price: 25.9, imageUrl: null, quantity: 2 },
      ]),
    );

    renderWithProviders(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Sacola (2)')).toBeInTheDocument();
  });

  it('exibe itens do carrinho com nome e preco', () => {
    localStorage.setItem(
      'burguerhouse_cart',
      JSON.stringify([
        { id: 1, name: 'X-Burguer', price: 25.9, imageUrl: null, quantity: 1 },
        { id: 2, name: 'Coca-Cola', price: 7.5, imageUrl: null, quantity: 1 },
      ]),
    );

    renderWithProviders(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('X-Burguer')).toBeInTheDocument();
    expect(screen.getByText('Coca-Cola')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no overlay', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<CartDrawer isOpen={true} onClose={onClose} />);

    const overlay = screen.getByRole('button', { name: 'Fechar carrinho' });
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('chama onClose ao pressionar Enter no overlay', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<CartDrawer isOpen={true} onClose={onClose} />);

    const overlay = screen.getByRole('button', { name: 'Fechar carrinho' });
    overlay.focus();
    await user.keyboard('{Enter}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('nao renderiza overlay quando fechado', () => {
    renderWithProviders(<CartDrawer isOpen={false} onClose={vi.fn()} />);

    expect(
      screen.queryByRole('button', { name: 'Fechar carrinho' }),
    ).not.toBeInTheDocument();
  });

  it('exibe botao de finalizar pedido quando ha itens', () => {
    localStorage.setItem(
      'burguerhouse_cart',
      JSON.stringify([
        { id: 1, name: 'X-Burguer', price: 25.9, imageUrl: null, quantity: 1 },
      ]),
    );

    renderWithProviders(<CartDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Finalizar Pedido')).toBeInTheDocument();
  });
});
