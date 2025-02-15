import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Trash } from 'lucide-react';

interface Expense {
  item: string;
  amount: number;
  paidBy: string;
}

export default function ConcertExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Expense>({ item: '', amount: 0, paidBy: '' });

  const addExpense = () => {
    if (newExpense.item && newExpense.amount && newExpense.paidBy) {
      setExpenses([...expenses, newExpense]);
      setNewExpense({ item: '', amount: 0, paidBy: '' });
    }
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-400 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Concert Expense Tracker</h1>
      <Card className="mb-4 p-4 bg-white shadow-xl rounded-2xl">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input placeholder="Expense Item" value={newExpense.item} onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })} />
            <Input type="number" placeholder="Amount ($)" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })} />
            <Input placeholder="Paid by" value={newExpense.paidBy} onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })} />
          </div>
          <Button onClick={addExpense} className="w-full bg-blue-600 text-white font-semibold rounded-xl py-2 hover:bg-blue-700">Add Expense</Button>
        </CardContent>
      </Card>

      <Card className="p-4 bg-white shadow-xl rounded-2xl">
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid By</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.item}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.paidBy}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => removeExpense(index)}><Trash size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
