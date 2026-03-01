import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
	return (
		<div className='flex min-h-screen w-full bg-white'>
			{/* Left side cover placeholder */}
			<div className='hidden lg:block lg:w-1/2 relative'>
				<Image
					src='/indian_fabrics.png'
					alt='Vibrant Indian Fabrics'
					fill
					className='object-cover'
					priority
				/>
				<div className='absolute inset-0 bg-black/10'></div>
			</div>

			{/* Right side form */}
			<div className='w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white'>
				<div className='w-full max-w-md space-y-6'>
					<div className='text-center'>
						<h2 className='text-4xl font-black mb-2 tracking-tight'>
							Signup to Fabric
							<span className='text-brand-red'>Hub</span>
						</h2>
						<p className='text-zinc-500 text-sm'>
							Welcome! Please enter your details.
						</p>
					</div>

					<form className='space-y-4'>
						<div className='space-y-1.5'>
							<label className='text-sm font-semibold text-zinc-900 block'>
								Your name
							</label>
							<Input
								type='text'
								placeholder='Enter your name'
								className='py-5'
							/>
						</div>

						<div className='space-y-1.5'>
							<label className='text-sm font-semibold text-zinc-900 block'>
								Your Email / Password
							</label>
							<Input
								type='email'
								placeholder='Enter your email or password'
								className='py-5'
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-1.5'>
								<label className='text-sm font-semibold text-zinc-900 block'>
									Password
								</label>
								<div className='relative'>
									<Input
										type='password'
										placeholder='••••••'
										className='py-5'
									/>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500'
									>
										<svg
											width='16'
											height='16'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
											<path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
											<path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
											<line
												x1='2'
												x2='22'
												y1='2'
												y2='22'
											/>
										</svg>
									</button>
								</div>
							</div>

							<div className='space-y-1.5'>
								<label className='text-sm font-semibold text-zinc-900 block'>
									Confirm Password
								</label>
								<div className='relative'>
									<Input
										type='password'
										placeholder='••••••'
										className='py-5'
									/>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500'
									>
										<svg
											width='16'
											height='16'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
											<path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
											<path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
											<line
												x1='2'
												x2='22'
												y1='2'
												y2='22'
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						<Button
							type='submit'
							className='w-full py-6 font-semibold bg-zinc-900 text-white hover:bg-zinc-800 mt-2'
						>
							Sign up
						</Button>
					</form>

					<div className='text-center text-sm font-medium mt-6'>
						Already has an account?{' '}
						<Link
							href='/login'
							className='text-brand-red hover:underline ml-1'
						>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
