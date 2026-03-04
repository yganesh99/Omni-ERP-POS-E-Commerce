import { Product } from '@/app/pos/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
	product: Product;
	onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
	return (
		<Card
			className='overflow-hidden cursor-pointer touch-manipulation hover:border-black transition-all bg-white rounded-xl border border-zinc-200 shadow-sm h-full flex flex-col group'
			onClick={() => onAdd(product)}
		>
			<div className='relative aspect-square bg-muted'>
				{/* Using standard img for robust mockup without Next.js domains config issues */}
				<img
					src={product.image}
					alt={product.name}
					className='object-cover w-full h-full'
					loading='lazy'
				/>
			</div>
			<CardContent className='p-3 flex-1 flex flex-col justify-between gap-2'>
				<div>
					<h3 className='font-medium text-sm line-clamp-2 leading-tight'>
						{product.name}
					</h3>
					<p className='text-xs text-muted-foreground mt-1'>
						{product.barcode}
					</p>
				</div>
				<div className='flex items-center justify-between mt-2'>
					<span className='font-bold text-base'>
						රු{product.price.toFixed(2)}
					</span>
					<Button
						size='icon'
						variant='default'
						className='h-8 w-8 rounded-full shrink-0 touch-manipulation relative z-10 bg-black text-white hover:bg-zinc-800 transition-colors'
					>
						<Plus className='h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
