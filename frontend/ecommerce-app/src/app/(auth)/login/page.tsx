'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
	const { login } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await login(email, password);
			const callbackUrl = searchParams.get('callbackUrl') || '/';
			router.push(callbackUrl);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : 'Something went wrong',
			);
		} finally {
			setLoading(false);
		}
	}

	function handleGoogleSignIn() {
		const apiBase =
			process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
		window.location.href = `${apiBase}/auth/google`;
	}

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
				<div className='w-full max-w-md space-y-8'>
					<div className='text-center'>
						<h2 className='text-3xl font-black mb-2'>
							Welcome back!
						</h2>
						<p className='text-zinc-500 text-sm'>
							Please enter your details.
						</p>
					</div>

					<div className='space-y-6'>
						<Button
							type='button'
							variant='outline'
							className='w-full py-6 font-semibold flex items-center justify-center gap-2'
							onClick={handleGoogleSignIn}
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M22.56 12.25C22.56 11.47 22.49 10.74 22.36 10.04H12V14.23H17.92C17.66 15.58 16.89 16.73 15.74 17.51V20.24H19.3C21.39 18.32 22.56 15.54 22.56 12.25Z'
									fill='#4285F4'
								/>
								<path
									d='M12 23C14.97 23 17.46 22.02 19.3 20.24L15.74 17.51C14.74 18.18 13.48 18.59 12 18.59C9.13 18.59 6.7 16.65 5.8 14.05H2.15V16.88C3.96 20.48 7.69 23 12 23Z'
									fill='#34A853'
								/>
								<path
									d='M5.8 14.05C5.57 13.37 5.44 12.65 5.44 11.91C5.44 11.17 5.57 10.45 5.8 9.77V6.94H2.15C1.41 8.42 1 10.12 1 11.91C1 13.7 1.41 15.4 2.15 16.88L5.8 14.05Z'
									fill='#FBBC05'
								/>
								<path
									d='M12 5.23C13.62 5.23 15.06 5.79 16.21 6.89L19.39 3.71C17.46 1.91 14.97 0.820007 12 0.820007C7.69 0.820007 3.96 3.34001 2.15 6.94L5.8 9.77C6.7 7.17 9.13 5.23 12 5.23Z'
									fill='#EA4335'
								/>
							</svg>
							Sign in with Google
						</Button>

						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-zinc-200' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='bg-white px-4 text-zinc-500 font-medium'>
									Or
								</span>
							</div>
						</div>

						<form
							className='space-y-4'
							onSubmit={handleSubmit}
						>
							<div className='space-y-1.5'>
								<label className='text-sm font-semibold text-zinc-900 block'>
									Email
								</label>
								<Input
									type='email'
									placeholder='Enter your email'
									className='py-5'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete='email'
								/>
							</div>

							<div className='space-y-1.5'>
								<label className='text-sm font-semibold text-zinc-900 block'>
									Password
								</label>
								<div className='relative'>
									<Input
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder='Enter your password'
										className='py-5'
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
										autoComplete='current-password'
									/>
									<button
										type='button'
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 transition-colors'
									>
										{showPassword ? (
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
												<path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z' />
												<circle
													cx='12'
													cy='12'
													r='3'
												/>
											</svg>
										) : (
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
										)}
									</button>
								</div>
							</div>

							{error && (
								<p className='text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded px-3 py-2'>
									{error}
								</p>
							)}

							<div className='flex items-center justify-end text-sm py-1'>
								<Link
									href='/forgot'
									className='font-semibold text-zinc-900 hover:text-brand-red'
								>
									Forgot Password
								</Link>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full py-6 font-semibold bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-60'
							>
								{loading ? 'Signing in…' : 'Sign in'}
							</Button>
						</form>

						<div className='text-center text-sm font-medium'>
							Don&apos;t have an account?{' '}
							<Link
								href='/signup'
								className='text-brand-red hover:underline ml-1'
							>
								Create account
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
