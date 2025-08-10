
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/': 'Home',
  '/hackathon': 'Hackathons',
  '/incubation': 'Incubation Program',
  '/mvp-lab': 'MVP Lab',
  '/inclab': 'INC Lab',
  '/resources': 'Resources',
  '/partnership': 'Partnership',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/startup-directory': 'Startup Directory',
  '/startup-profile': 'Startup Profile',
  '/deals': 'Deals',
  '/blogs': 'Blogs',
  '/news': 'News',
  '/meet-cofounder': 'Find Co-founder',
  '/investor-centre': 'Investor Centre',
  '/investor-profile': 'Investor Profile',
  '/success-stories': 'Success Stories',
  '/become-mentor': 'Become a Mentor',
  '/program-details': 'Program Details',
  '/current-cohort': 'Current Cohort',
  '/featured-startups': 'Featured Startups',
  '/philosophy': 'Our Philosophy',
  '/all-applications': 'All Applications',
  '/consultation-booking': 'Book Consultation',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
  '/startup-dashboard': 'Startup Dashboard',
  '/admin-dashboard': 'Admin Dashboard',
  '/privacy-policy': 'Privacy Policy',
  '/terms-conditions': 'Terms & Conditions',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (location.pathname === '/') {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const breadcrumbName = breadcrumbMap[routeTo] || pathname.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return (
              <React.Fragment key={routeTo}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{breadcrumbName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{breadcrumbName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
