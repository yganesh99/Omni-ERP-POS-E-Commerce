import { TopNav } from '@/components/pos/TopNav';
import { BottomNav } from '@/components/pos/BottomNav';
import RoleGuard from '@/components/RoleGuard';

export default function PosLayout({ children }: { children: React.ReactNode }) {
	return (
		<RoleGuard allowedRoles={['admin', 'cashier']}>
			<div className='min-h-screen bg-background text-foreground flex flex-col font-sans'>
				<TopNav />
				<main className='flex-1 flex overflow-hidden'>{children}</main>
				<BottomNav />
			</div>
		</RoleGuard>
	);
}
