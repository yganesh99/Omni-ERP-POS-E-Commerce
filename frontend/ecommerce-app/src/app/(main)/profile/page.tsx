import Link from 'next/link';
import { EyeOff } from 'lucide-react';

export default function ProfilePage() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-[1000px] min-h-[60vh]'>
			{/* Breadcrumbs */}
			<div className='flex items-center text-xs text-zinc-500 mb-6 space-x-2'>
				<Link
					href='/'
					className='hover:text-brand-dark transition-colors'
				>
					Home
				</Link>
				<span>&gt;</span>
				<span className='text-zinc-900 font-medium'>View Profile</span>
			</div>

			<h1 className='text-2xl font-bold mb-10'>My Profile</h1>

			{/* Main Profile Header Section */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 mb-12'>
				<div className='w-24 h-24 rounded-full bg-zinc-200 mr-6 flex-shrink-0'></div>
				<div className='flex-1'>
					<h2 className='text-lg font-bold text-zinc-900'>
						Arthur Morgan
					</h2>
					<p className='text-zinc-600 text-sm'>
						arthurmorgan@gmail.com
					</p>
				</div>
				<div className='flex space-x-4'>
					<button className='bg-black text-white px-6 py-2.5 text-sm font-semibold rounded-sm hover:bg-zinc-800 transition-colors'>
						Upload New Photo
					</button>
					<button className='bg-white border text-zinc-900 border-zinc-300 px-6 py-2.5 text-sm font-semibold rounded-sm hover:bg-zinc-50 transition-colors'>
						Delete
					</button>
				</div>
			</div>

			{/* Personal Information */}
			<div className='mb-14'>
				<h3 className='text-lg font-bold mb-6'>Personal Information</h3>
				<form className='space-y-5'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								First Name
							</label>
							<input
								type='text'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Last Name
							</label>
							<input
								type='text'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
					</div>

					<div className='space-y-1.5'>
						<label className='text-sm text-zinc-600 block'>
							Address
						</label>
						<input
							type='text'
							className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Email Address
							</label>
							<input
								type='email'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Phone Number
							</label>
							<input
								type='tel'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Country/Region
							</label>
							<input
								type='text'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								City
							</label>
							<input
								type='text'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Postal Code
							</label>
							<input
								type='text'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 outline-none focus:border-zinc-500'
							/>
						</div>
					</div>

					<button
						type='button'
						className='bg-black text-white px-8 py-2.5 mt-4 text-sm font-semibold rounded-sm hover:bg-zinc-800 transition-colors'
					>
						Save Changes
					</button>
				</form>
			</div>

			<div className='border-t border-zinc-100 mb-10'></div>

			{/* Change Password */}
			<div className='mb-14'>
				<h3 className='text-lg font-bold mb-1'>Change Password</h3>
				<p className='text-xs text-zinc-500 mb-6'>
					Your password must contain atleast 8 characters with a
					minimum of 1 number and 1 special character (@?.,).
				</p>

				<form className='space-y-5'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-1.5'>
							<label className='text-sm text-zinc-600 block'>
								Current Password
							</label>
							<div className='relative'>
								<input
									type='password'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 pr-10 outline-none focus:border-zinc-500'
								/>
								<EyeOff className='w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' />
							</div>
						</div>
						<div className='space-y-1.5 flex flex-col justify-end'>
							{/* Empty intentionally to push New Password down or to the right on desktop */}
							<label className='text-sm text-zinc-600 block'>
								New Password
							</label>
							<div className='relative'>
								<input
									type='password'
									className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 pr-10 outline-none focus:border-zinc-500'
								/>
								<EyeOff className='w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' />
							</div>
						</div>
					</div>

					<div className='w-full md:w-[calc(50%-12px)] space-y-1.5'>
						<label className='text-sm text-zinc-600 block'>
							Confirm New Password
						</label>
						<div className='relative'>
							<input
								type='password'
								className='w-full border border-zinc-300 rounded-sm px-4 py-2.5 pr-10 outline-none focus:border-zinc-500'
							/>
							<EyeOff className='w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer' />
						</div>
					</div>

					<button
						type='button'
						className='bg-black text-white px-8 py-2.5 mt-4 text-sm font-semibold rounded-sm hover:bg-zinc-800 transition-colors'
					>
						Save Changes
					</button>
				</form>
			</div>

			<div className='border-t border-zinc-100 mb-10'></div>

			{/* Delete Account */}
			<div className='mb-16'>
				<h3 className='text-lg font-bold mb-1'>Delete My Account</h3>
				<p className='text-xs text-zinc-500 mb-6'>
					Once deleted you will permanently lose all your data linked
					to this account.
				</p>
				<button className='bg-brand-red text-white px-6 py-2.5 text-sm font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors'>
					Close Your Account
				</button>
			</div>
		</div>
	);
}
