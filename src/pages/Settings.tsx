
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save, PlusCircle, UserPlus, Mail, MessageCircle, Bell } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <Button className="bg-brand text-white hover:bg-brand-dark">
              Save Changes
            </Button>
          </div>
          
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="integration">Integrations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Company Profile</h3>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 relative mb-3">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src="/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png" />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                            <Upload size={14} />
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Logo
                      </Button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input id="companyName" defaultValue="Ship Sync Connect" />
                        </div>
                        <div>
                          <Label htmlFor="legalName">Legal Name</Label>
                          <Input id="legalName" defaultValue="ShipSync Inc." />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Commerce Street" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="San Francisco" />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="California" />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input id="zipCode" defaultValue="94107" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="contact@shipsync.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://shipsync.com" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Business Details</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                        <Input id="taxId" defaultValue="US-987654321" />
                      </div>
                      <div>
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input id="registrationNumber" defaultValue="REG-123456" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Business Type</Label>
                      <div className="flex gap-4 mt-2">
                        {['E-commerce', 'Retail', 'Wholesale', 'Manufacturing', 'Services'].map(type => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox id={`type-${type}`} />
                            <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Shipping Volume (Monthly)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {['< 100', '100-500', '501-1000', '1000+'].map(volume => (
                          <div key={volume} className="flex items-center gap-2">
                            <Checkbox id={`volume-${volume}`} />
                            <label htmlFor={`volume-${volume}`} className="text-sm">{volume}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-brand text-white hover:bg-brand-dark">
                      <Save className="mr-2 h-4 w-4" /> Save Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Team Members</h3>
                    <Button className="bg-brand text-white hover:bg-brand-dark">
                      <UserPlus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      {
                        name: 'Alex Johnson',
                        email: 'alex@shipsync.com',
                        role: 'Admin',
                        avatar: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png'
                      },
                      {
                        name: 'Sarah Williams',
                        email: 'sarah.w@shipsync.com',
                        role: 'Manager',
                        avatar: ''
                      },
                      {
                        name: 'Michael Chen',
                        email: 'michael.c@shipsync.com',
                        role: 'Support',
                        avatar: ''
                      }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{member.role}</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">User Roles</h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        role: 'Admin',
                        description: 'Full access to all settings and features'
                      },
                      {
                        role: 'Manager',
                        description: 'Can manage orders, inventory, and reports, but cannot change system settings'
                      },
                      {
                        role: 'Support',
                        description: 'View-only access to orders and customer information'
                      },
                      {
                        role: 'Finance',
                        description: 'Access to financial reports and transactions only'
                      }
                    ].map((role, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{role.role}</h4>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                        {index < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Custom Role
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="integration">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-6">Courier Integrations</h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        name: 'FedEx',
                        status: 'Connected',
                        icon: '📦'
                      },
                      {
                        name: 'DHL',
                        status: 'Connected',
                        icon: '🚚'
                      },
                      {
                        name: 'UPS',
                        status: 'Not Connected',
                        icon: '📬'
                      },
                      {
                        name: 'USPS',
                        status: 'Not Connected',
                        icon: '📫'
                      }
                    ].map((courier, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xl">
                            {courier.icon}
                          </div>
                          <div>
                            <div className="font-medium">{courier.name}</div>
                            <div className="text-sm text-gray-500">API Integration</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant={courier.status === 'Connected' ? 'default' : 'outline'}>
                            {courier.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {courier.status === 'Connected' ? 'Configure' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium mb-6">E-commerce Platform Integrations</h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        name: 'Shopify',
                        status: 'Connected',
                        icon: '🛒'
                      },
                      {
                        name: 'WooCommerce',
                        status: 'Not Connected',
                        icon: '🛍️'
                      },
                      {
                        name: 'Magento',
                        status: 'Not Connected',
                        icon: '🏪'
                      }
                    ].map((platform, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xl">
                            {platform.icon}
                          </div>
                          <div>
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-sm text-gray-500">Store Connection</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant={platform.status === 'Connected' ? 'default' : 'outline'}>
                            {platform.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {platform.status === 'Connected' ? 'Configure' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-4">Email Notifications</h4>
                      <div className="space-y-3">
                        {[
                          'New order received',
                          'Order status changes',
                          'Delivery confirmation',
                          'Returns initiated',
                          'COD collected',
                          'Low inventory alerts'
                        ].map(notification => (
                          <div key={notification} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail size={18} className="text-gray-500" />
                              <label htmlFor={`email-${notification}`} className="text-sm">
                                {notification}
                              </label>
                            </div>
                            <Checkbox id={`email-${notification}`} defaultChecked={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-4">SMS Notifications</h4>
                      <div className="space-y-3">
                        {[
                          'Critical delivery issues',
                          'Returns processing',
                          'COD collection confirmation',
                          'Failed delivery attempts'
                        ].map(notification => (
                          <div key={notification} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MessageCircle size={18} className="text-gray-500" />
                              <label htmlFor={`sms-${notification}`} className="text-sm">
                                {notification}
                              </label>
                            </div>
                            <Checkbox id={`sms-${notification}`} defaultChecked={notification === 'Critical delivery issues'} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-4">In-App Notifications</h4>
                      <div className="space-y-3">
                        {[
                          'All order updates',
                          'System alerts',
                          'Team mentions',
                          'Report generation completed',
                          'Courier performance issues'
                        ].map(notification => (
                          <div key={notification} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Bell size={18} className="text-gray-500" />
                              <label htmlFor={`app-${notification}`} className="text-sm">
                                {notification}
                              </label>
                            </div>
                            <Checkbox id={`app-${notification}`} defaultChecked={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-brand text-white hover:bg-brand-dark">
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-6">System Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-medium">Display Settings</h4>
                      
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" defaultValue="(UTC-08:00) Pacific Time" />
                      </div>
                      
                      <div>
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Input id="dateFormat" defaultValue="MM/DD/YYYY" />
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox id="darkMode" />
                        <label htmlFor="darkMode">Enable dark mode</label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Checkbox id="compactView" />
                        <label htmlFor="compactView">Use compact view</label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Default Settings</h4>
                      
                      <div>
                        <Label htmlFor="defaultCourier">Default Courier</Label>
                        <Input id="defaultCourier" defaultValue="FedEx" />
                      </div>
                      
                      <div>
                        <Label htmlFor="defaultPage">Default Landing Page</Label>
                        <Input id="defaultPage" defaultValue="Dashboard" />
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox id="autoRefresh" defaultChecked />
                        <label htmlFor="autoRefresh">Auto-refresh dashboard data</label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Checkbox id="emailReceipts" defaultChecked />
                        <label htmlFor="emailReceipts">Send email receipts for all orders</label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Data Export & Import</h4>
                    
                    <div className="flex gap-4">
                      <Button variant="outline">Export All Data</Button>
                      <Button variant="outline">Import Data</Button>
                      <Button variant="outline">Sync Settings</Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-brand text-white hover:bg-brand-dark">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
