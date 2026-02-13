import { Link, Outlet, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	Package,
	Warehouse,
	ShoppingCart,
	Users,
	Truck,
	FileText,
	BarChart3,
	Settings,
	Store,
	ChevronLeft,
	LogOut,
	Receipt,
	DollarSign,
	UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
	{ label: 'Dashboard', icon: LayoutDashboard, path: '/erp' },
	{ label: 'Products', icon: Package, path: '/erp/products' },
	{ label: 'Inventory', icon: Warehouse, path: '/erp/inventory' },
	{ label: 'Orders', icon: ShoppingCart, path: '/erp/orders' },
	{ label: 'Customers', icon: Users, path: '/erp/customers' },
	{ label: 'Suppliers', icon: Truck, path: '/erp/suppliers' },
	{
		label: 'Supplier Invoices',
		icon: Receipt,
		path: '/erp/supplier-invoices',
	},
	{ label: 'Purchase Orders', icon: FileText, path: '/erp/purchase-orders' },
	{ label: 'Finance', icon: DollarSign, path: '/erp/finance' },
	{ label: 'Reports', icon: BarChart3, path: '/erp/reports' },
	{ label: 'Staff & Users', icon: UserCog, path: '/erp/users' },
	{ label: 'Settings', icon: Settings, path: '/erp/settings' },
];

const ERPLayout = () => {
	const location = useLocation();

	return (
		<div className='h-screen flex bg-background'>
			{/* Sidebar */}
			<aside className='w-64 bg-sidebar flex flex-col shrink-0'>
				<div className='p-4 flex items-center gap-2 border-b border-sidebar-border'>
					<div className='h-8 w-8 rounded-lg gradient-primary flex items-center justify-center'>
						<span className='text-primary-foreground font-bold text-sm'>
							O
						</span>
					</div>
					<div>
						<span className='font-display font-bold text-sidebar-accent-foreground text-sm'>
							OmniStore
						</span>
						<p className='text-[10px] text-sidebar-foreground/50'>
							ERP Backend
						</p>
					</div>
				</div>

				<nav className='flex-1 py-4 px-3 space-y-1 overflow-auto'>
					{navItems.map(({ label, icon: Icon, path }) => {
						const isActive = location.pathname === path;
						return (
							<Link
								key={path}
								to={path}
								className={cn(
									'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
									isActive
										? 'bg-sidebar-accent text-sidebar-primary font-medium'
										: 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
								)}
							>
								<Icon className='h-4 w-4' />
								{label}
							</Link>
						);
					})}
				</nav>

				<div className='p-3 border-t border-sidebar-border space-y-1'>
					<Link
						to='/pos'
						className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors'
					>
						<Store className='h-4 w-4' /> POS Terminal
					</Link>
					<Link
						to='/'
						className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors'
					>
						<ChevronLeft className='h-4 w-4' /> Storefront
					</Link>
				</div>
			</aside>

			{/* Main content */}
			<div className='flex-1 flex flex-col overflow-hidden'>
				<header className='h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0'>
					<h1 className='text-sm font-medium text-foreground'>
						{navItems.find((n) => n.path === location.pathname)
							?.label || 'ERP'}
					</h1>
					<div className='flex items-center gap-2'>
						<span className='text-xs text-muted-foreground'>
							admin@omnistore.com
						</span>
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8 text-muted-foreground'
						>
							<LogOut className='h-4 w-4' />
						</Button>
					</div>
				</header>

				<main className='flex-1 overflow-auto p-6 animate-fade-in'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

// Need to import Button for the header
import { Button } from '@/components/ui/button';

export default ERPLayout;
