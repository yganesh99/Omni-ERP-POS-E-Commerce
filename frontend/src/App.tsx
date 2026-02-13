import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EcommerceLayout from '@/components/ecommerce/EcommerceLayout';
import EcommerceHome from '@/pages/EcommerceHome';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import POS from '@/pages/POS';
import ERPLayout from '@/components/erp/ERPLayout';
import ERPDashboard from '@/pages/erp/ERPDashboard';
import ERPProducts from '@/pages/erp/ERPProducts';
import ERPInventory from '@/pages/erp/ERPInventory';
import ERPOrders from '@/pages/erp/ERPOrders';
import ERPCustomers from '@/pages/erp/ERPCustomers';
import ERPSuppliers from '@/pages/erp/ERPSuppliers';
import ERPSupplierInvoices from '@/pages/erp/ERPSupplierInvoices';
import ERPSupplierInvoiceDetail from '@/pages/erp/ERPSupplierInvoiceDetail';
import ERPPurchaseOrders from '@/pages/erp/ERPPurchaseOrders';
import ERPReports from '@/pages/erp/ERPReports';
import ERPFinance from '@/pages/erp/ERPFinance';
import ERPUsers from '@/pages/erp/ERPUsers';
import ERPSettings from '@/pages/erp/ERPSettings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					{/* Ecommerce */}
					<Route element={<EcommerceLayout />}>
						<Route
							path='/'
							element={<EcommerceHome />}
						/>
						<Route
							path='/shop'
							element={<Shop />}
						/>
						<Route
							path='/product/:id'
							element={<ProductDetail />}
						/>
						<Route
							path='/cart'
							element={<Cart />}
						/>
						<Route
							path='/checkout'
							element={<Checkout />}
						/>
					</Route>

					{/* POS */}
					<Route
						path='/pos'
						element={<POS />}
					/>

					{/* ERP */}
					<Route
						path='/erp'
						element={<ERPLayout />}
					>
						<Route
							index
							element={<ERPDashboard />}
						/>
						<Route
							path='products'
							element={<ERPProducts />}
						/>
						<Route
							path='inventory'
							element={<ERPInventory />}
						/>
						<Route
							path='orders'
							element={<ERPOrders />}
						/>
						<Route
							path='customers'
							element={<ERPCustomers />}
						/>
						<Route
							path='suppliers'
							element={<ERPSuppliers />}
						/>
						<Route
							path='supplier-invoices'
							element={<ERPSupplierInvoices />}
						/>
						<Route
							path='supplier-invoices/:id'
							element={<ERPSupplierInvoiceDetail />}
						/>
						<Route
							path='purchase-orders'
							element={<ERPPurchaseOrders />}
						/>
						<Route
							path='reports'
							element={<ERPReports />}
						/>
						<Route
							path='finance'
							element={<ERPFinance />}
						/>
						<Route
							path='settings'
							element={<ERPSettings />}
						/>
						<Route
							path='users'
							element={<ERPUsers />}
						/>
					</Route>

					<Route
						path='*'
						element={<NotFound />}
					/>
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
