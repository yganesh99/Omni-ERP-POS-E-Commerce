import type { Metadata } from 'next';
import './globals.css';

import { Poppins } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-poppins',
});

export const metadata: Metadata = {
	title: 'FabricHub - Where Fabric Meets Imagination',
	description: 'Global sourced premium fabrics and tools for makers',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${poppins.variable} font-sans min-h-screen flex flex-col bg-white text-zinc-900`}
			>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
