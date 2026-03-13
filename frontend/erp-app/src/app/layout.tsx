import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';

export const metadata = {
	title: 'ERP App',
	description: 'Enterprise Resource Planning MVP',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<AuthProvider>{children}</AuthProvider>
				<ToastContainer position='bottom-right' />
			</body>
		</html>
	);
}
