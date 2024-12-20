'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export function RecentOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?limit=5');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{order.customer.name}</span>
                <span className="text-sm text-muted-foreground">
                  {order.customer.email}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === 'completed'
                    ? 'default'
                    : order.status === 'processing'
                    ? 'secondary'
                    : order.status === 'pending'
                    ? 'warning'
                    : 'destructive'
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(order.total, 'USD')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}