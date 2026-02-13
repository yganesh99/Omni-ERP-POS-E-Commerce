import { useState } from 'react';
import {
	Plus,
	Search,
	MoreVertical,
	Mail,
	Shield,
	Trash2,
	Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { stores } from '@/data/mockData';

// Mock users data
const mockUsers = [
	{
		id: 1,
		name: 'Admin User',
		email: 'admin@omnistore.com',
		role: 'Business Admin',
		status: 'Active',
	},
	{
		id: 2,
		name: 'Store Manager A',
		email: 'manager.a@omnistore.com',
		role: 'Store Manager',
		store: 'Main Store',
		status: 'Active',
	},
	{
		id: 3,
		name: 'John Cashier',
		email: 'john.c@omnistore.com',
		role: 'Cashier',
		store: 'Main Store',
		status: 'Active',
	},
	{
		id: 4,
		name: 'Inventory Lead',
		email: 'inv@omnistore.com',
		role: 'Inventory Manager',
		status: 'Inactive',
	},
];

const ERPUsers = () => {
	const [users, setUsers] = useState(mockUsers);
	const [isInviteOpen, setIsInviteOpen] = useState(false);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold font-display text-foreground'>
						User Management
					</h1>
					<p className='text-sm text-muted-foreground'>
						Manage staff access and roles
					</p>
				</div>
				<Dialog
					open={isInviteOpen}
					onOpenChange={setIsInviteOpen}
				>
					<DialogTrigger asChild>
						<Button className='gap-2'>
							<Plus className='h-4 w-4' /> Invite User
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Invite New User</DialogTitle>
							<DialogDescription>
								Send an invitation email to add a new team
								member.
							</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									placeholder='colleague@company.com'
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='role'>Role</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder='Select role' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='admin'>
											Business Admin
										</SelectItem>
										<SelectItem value='manager'>
											Store Manager
										</SelectItem>
										<SelectItem value='inventory'>
											Inventory Manager
										</SelectItem>
										<SelectItem value='cashier'>
											Cashier
										</SelectItem>
										<SelectItem value='accountant'>
											Accountant
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='store'>
									Assigned Store (Optional)
								</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder='Select store' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>
											All Stores (Admin only)
										</SelectItem>
										{stores.map((s) => (
											<SelectItem
												key={s.id}
												value={s.id}
											>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={() => setIsInviteOpen(false)}>
								Send Invitation
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className='flex items-center gap-4'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search users...'
						className='pl-10'
					/>
				</div>
			</div>

			<Card>
				<CardContent className='p-0'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border'>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium w-[300px]'>
									User
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Role
								</th>
								<th className='text-left py-3 px-4 text-muted-foreground font-medium'>
									Store Access
								</th>
								<th className='text-right py-3 px-4 text-muted-foreground font-medium'>
									Status
								</th>
								<th className='w-[50px]'></th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user.id}
									className='border-b border-border/50 hover:bg-muted/50 transition-colors'
								>
									<td className='py-3 px-4'>
										<div className='flex items-center gap-3'>
											<div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
												<span className='font-medium text-xs'>
													{user.name.charAt(0)}
												</span>
											</div>
											<div>
												<p className='font-medium text-foreground'>
													{user.name}
												</p>
												<p className='text-xs text-muted-foreground'>
													{user.email}
												</p>
											</div>
										</div>
									</td>
									<td className='py-3 px-4'>
										<div className='flex items-center gap-2'>
											<Shield className='h-3 w-3 text-primary' />
											<span>{user.role}</span>
										</div>
									</td>
									<td className='py-3 px-4 text-muted-foreground'>
										{user.store || 'All Stores'}
									</td>
									<td className='py-3 px-4 text-right'>
										<Badge
											variant={
												user.status === 'Active'
													? 'default'
													: 'secondary'
											}
										>
											{user.status}
										</Badge>
									</td>
									<td className='py-3 px-4'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'
													className='h-8 w-8'
												>
													<MoreVertical className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuItem>
													<Mail className='mr-2 h-4 w-4' />{' '}
													Resend Invite
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Ban className='mr-2 h-4 w-4' />{' '}
													Deactivate
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className='text-destructive'>
													<Trash2 className='mr-2 h-4 w-4' />{' '}
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>
		</div>
	);
};

export default ERPUsers;
