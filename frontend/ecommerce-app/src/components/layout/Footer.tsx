import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
	return (
		<footer className='bg-brand-dark text-white'>
			<div className='container mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='space-y-4'>
						<h4 className='font-bold text-sm'>
							NEWSLETTER SUBSCRIPTION
						</h4>
						<p className='text-xs text-zinc-400'>
							Sign up for FabricHub updates to receive information
							about new arrivals, offers & promos.
						</p>
						<form className='flex flex-col space-y-2 mt-4'>
							<input
								type='email'
								placeholder='Enter Your Email Address'
								className='bg-transparent border border-zinc-600 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white'
							/>
							<button
								type='submit'
								className='bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors px-4 py-2 text-xs font-bold w-full uppercase'
							>
								SUBSCRIBE!
							</button>
						</form>
					</div>

					<div className='space-y-4'>
						<h4 className='font-bold text-sm'>Quick Links</h4>
						<ul className='space-y-2 text-xs text-zinc-400'>
							<li>
								<Link
									href='/category/fashion'
									className='hover:text-white'
								>
									Fashion Fabrics
								</Link>
							</li>
							<li>
								<Link
									href='/category/leather'
									className='hover:text-white'
								>
									Leather
								</Link>
							</li>
							<li>
								<Link
									href='/category/buttons'
									className='hover:text-white'
								>
									Buttons
								</Link>
							</li>
							<li>
								<Link
									href='/category/sewing'
									className='hover:text-white'
								>
									Sewing Notions
								</Link>
							</li>
							<li>
								<Link
									href='/sale'
									className='hover:text-white'
								>
									Sale
								</Link>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='font-bold text-sm'>More Information</h4>
						<ul className='space-y-2 text-xs text-zinc-400'>
							<li>
								<Link
									href='/about'
									className='hover:text-white'
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/privacy'
									className='hover:text-white'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/returns'
									className='hover:text-white'
								>
									Refund & Return/Exchange policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='hover:text-white'
								>
									Terms & Conditions
								</Link>
							</li>
						</ul>
					</div>

					<div className='space-y-4 text-xs text-zinc-400'>
						<p>Phone : 077 1234 567</p>
						<p>
							Operating Hours : Monday - Friday:
							<br />
							9.30 am - 5.30 pm
						</p>
						<p>Email : FabricHub@gmail.com</p>
						<div className='pt-4'>
							<h4 className='font-bold text-sm text-white mb-2'>
								Connect With Us
							</h4>
							<div className='flex space-x-4'>
								<Link
									href='#'
									className='hover:text-white'
								>
									<Facebook className='w-5 h-5' />
								</Link>
								<Link
									href='#'
									className='hover:text-white'
								>
									<Instagram className='w-5 h-5' />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='border-t border-zinc-800 py-4 text-center text-xs text-zinc-500'>
				© 2026 Fabric<span className='text-brand-red'>Hub</span>. All
				rights reserved.
			</div>
		</footer>
	);
}
