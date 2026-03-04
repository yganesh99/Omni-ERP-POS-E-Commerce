'use client';

import RoleGuard from '@/components/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StockHistoryPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { id } = params;
	// Detailed historical snapshot data
	const historyData = [
		{
			period: '2026-02',
			openingStock: 12500,
			received: 4500,
			sold: 3800,
			adjusted: -50,
			closingStock: 13150,
			value: 'රු164,375',
		},
		{
			period: '2026-01',
			openingStock: 11000,
			received: 5000,
			sold: 3400,
			adjusted: -100,
			closingStock: 12500,
			value: 'රු156,250',
		},
		{
			period: '2025-12',
			openingStock: 14000,
			received: 2000,
			sold: 4900,
			adjusted: -100,
			closingStock: 11000,
			value: 'රු137,500',
		},
	];

	return (
		<RoleGuard allowedRoles={['admin']}>
			<div className='space-y-6'>
				<div className='flex items-center space-x-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.back()}
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div className='flex-1 flex items-center justify-between'>
						<div>
							<h2 className='text-3xl font-bold tracking-tight'>
								Stock History (Admin)
							</h2>
							<p className='text-zinc-500'>
								Monthly historical snapshots of inventory levels
								and valuation for Product {id}.
							</p>
						</div>
						<Button
							className='flex items-center space-x-2'
							variant='outline'
						>
							<Download className='w-4 h-4' />
							<span>Export CSV</span>
						</Button>
					</div>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
						<CardTitle>Monthly History</CardTitle>
						<div className='flex items-center space-x-2'>
							<div className='relative'>
								<Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
								<Input
									type='text'
									placeholder='Search period...'
									className='w-64 pl-9 pr-4 py-1.5 h-9 text-sm'
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Period</TableHead>
									<TableHead className='text-right'>
										Opening Stock (m)
									</TableHead>
									<TableHead className='text-right'>
										Received (m)
									</TableHead>
									<TableHead className='text-right'>
										Sold (m)
									</TableHead>
									<TableHead className='text-right'>
										Adjusted (m)
									</TableHead>
									<TableHead className='text-right'>
										Closing Stock (m)
									</TableHead>
									<TableHead className='text-right'>
										Est. Value
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{historyData.map((row) => (
									<TableRow key={row.period}>
										<TableCell className='font-medium'>
											{row.period}
										</TableCell>
										<TableCell className='text-right'>
											{row.openingStock}
										</TableCell>
										<TableCell className='text-right text-green-600'>
											+{row.received}
										</TableCell>
										<TableCell className='text-right text-blue-600'>
											-{row.sold}
										</TableCell>
										<TableCell className='text-right text-amber-600'>
											{row.adjusted}
										</TableCell>
										<TableCell className='text-right font-bold'>
											{row.closingStock}
										</TableCell>
										<TableCell className='text-right'>
											{row.value}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</RoleGuard>
	);
}
