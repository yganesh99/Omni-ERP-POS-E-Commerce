import Link from 'next/link';

export default function AboutPage() {
	return (
		<div className='container mx-auto px-4 py-8 mb-16 w-full min-h-[60vh]'>
			{/* Breadcrumb */}
			<div className='text-xs text-zinc-500 mb-12 font-medium space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>&gt;</span>
				<span className='text-zinc-900'>About Us</span>
			</div>

			{/* Main Header */}
			<div className='text-center max-w-3xl mx-auto mb-16'>
				<h1 className='text-2xl md:text-3xl font-bold tracking-tight leading-snug'>
					Crafting Tomorrow, One Yard At A Time - Fabrics
					<br />
					Hub Empower You To Design With Purpose.
				</h1>
			</div>

			{/* Image & Text Grid */}
			<div className='flex flex-col md:flex-row gap-8 mb-24 items-center'>
				<div className='w-full md:w-1/2 aspect-[4/3] bg-zinc-200'>
					{/* Left Placeholder Image */}
				</div>

				<div className='w-full md:w-1/2 flex flex-col justify-center px-4'>
					<p className='text-[15px] font-bold text-zinc-900 leading-relaxed max-w-[450px] mb-8'>
						At FabricHub, Every Fabric Tells A Story. Create
						Beautiful Designs While Making Eco-Conscious Choices.
					</p>
					<div className='w-full aspect-video bg-zinc-200'>
						{/* Right Placeholder Image */}
					</div>
				</div>
			</div>

			{/* We Believe In Section */}
			<div className='text-center mb-16'>
				<h2 className='text-2xl font-bold tracking-tight mb-16'>
					We Believe In
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto'>
					{/* Quality */}
					<div className='flex flex-col items-center'>
						<div className='w-full h-48 bg-white border border-transparent shadow-sm rounded-lg mb-8 relative flex items-center justify-center'>
							<div className='w-48 h-32 bg-zinc-100 rounded-sm'></div>
						</div>
						<h3 className='text-lg font-bold mb-4'>Quality</h3>
						<p className='text-[11px] font-medium text-zinc-900 leading-relaxed max-w-[260px]'>
							We source fabrics that blend durability with
							elegance, ensuring your creations remain timeless
							and long-lasting.
						</p>
					</div>

					{/* Sustainability */}
					<div className='flex flex-col items-center'>
						<div className='w-full h-48 bg-white border border-transparent shadow-sm rounded-lg mb-8 relative flex items-center justify-center'>
							<div className='w-32 h-32 bg-zinc-100 rounded-full'></div>
						</div>
						<h3 className='text-lg font-bold mb-4'>
							Sustainability
						</h3>
						<p className='text-[11px] font-medium text-zinc-900 leading-relaxed max-w-[260px]'>
							We choose fabrics with care, supporting sustainable
							practices and ethical sourcing that respect both
							people and the planet.
						</p>
					</div>

					{/* Creativity */}
					<div className='flex flex-col items-center'>
						<div className='w-full h-48 bg-white border border-transparent shadow-sm rounded-lg mb-8 relative flex items-center justify-center'>
							<div className='w-48 h-32 bg-zinc-100 rounded-sm'></div>
						</div>
						<h3 className='text-lg font-bold mb-4'>Creativity</h3>
						<p className='text-[11px] font-medium text-zinc-900 leading-relaxed max-w-[260px]'>
							We celebrate creativity by offering fabrics that
							inspire, while fostering a community where makers
							can share, learn, and grow together.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
