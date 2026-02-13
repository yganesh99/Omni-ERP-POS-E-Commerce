import { Outlet } from "react-router-dom";
import EcommerceHeader from "./EcommerceHeader";
import EcommerceFooter from "./EcommerceFooter";

const EcommerceLayout = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <EcommerceHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <EcommerceFooter />
  </div>
);

export default EcommerceLayout;
