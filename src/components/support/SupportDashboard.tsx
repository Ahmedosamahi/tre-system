import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Users,
  MessageSquare,
  Star
} from 'lucide-react';

const ticketData = [
  { name: 'Mon', tickets: 24 },
  { name: 'Tue', tickets: 18 },
  { name: 'Wed', tickets: 32 },
  { name: 'Thu', tickets: 28 },
  { name: 'Fri', tickets: 15 },
  { name: 'Sat', tickets: 8 },
  { name: 'Sun', tickets: 5 }
];

const issueTypeData = [
  { name: 'Delivery Delays', value: 35, color: '#ef4444' },
  { name: 'Damaged Goods', value: 25, color: '#f97316' },
  { name: 'Lost Shipments', value: 20, color: '#eab308' },
  { name: 'Customer Info', value: 15, color: '#22c55e' },
  { name: 'Other', value: 5, color: '#6b7280' }
];

const supportMetrics = [
  {
    title: 'Open Tickets',
    value: '47',
    change: '+12%',
    icon: Ticket,
    color: 'text-blue-600'
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    change: '-8%',
    icon: Clock,
    color: 'text-green-600'
  },
  {
    title: 'Resolution Rate',
    value: '94%',
    change: '+3%',
    icon: CheckCircle,
    color: 'text-emerald-600'
  },
  {
    title: 'Customer Satisfaction',
    value: '4.7/5',
    change: '+0.2',
    icon: Star,
    color: 'text-yellow-600'
  }
];

const recentTickets = [
  {
    id: 'TK-001',
    issue: 'Delivery Delay',
    customer: 'Ahmed Hassan',
    priority: 'High',
    status: 'Open',
    time: '2 hours ago'
  },
  {
    id: 'TK-002',
    issue: 'Damaged Package',
    customer: 'Sarah Mohammed',
    priority: 'Medium',
    status: 'In Progress',
    time: '4 hours ago'
  },
  {
    id: 'TK-003',
    issue: 'Lost Shipment',
    customer: 'Omar Ali',
    priority: 'High',
    status: 'Open',
    time: '6 hours ago'
  }
];

interface SupportDashboardProps {
  className?: string;
}

export const SupportDashboard = ({ className }: SupportDashboardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Support Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          Admin View
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
              <p className="text-xs text-gray-500">
                <span className={metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                {' '}from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ticket Volume (Last 7 Days)</CardTitle>
            <CardDescription>Daily ticket creation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Issue Type Distribution</CardTitle>
            <CardDescription>Most common support issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
          <CardDescription>Latest support requests requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {ticket.id}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{ticket.issue}</p>
                    <p className="text-sm text-gray-600">Customer: {ticket.customer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{ticket.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};