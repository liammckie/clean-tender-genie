import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface NavItem {
  title: string;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'API Features',
    path: '/api-features',
    children: [
      { title: 'Models', path: '/api-features/models' },
      { title: 'Pricing', path: '/api-features/pricing' },
      { title: 'Tools', path: '/api-features/tools' },
      { title: 'Vector Stores', path: '/api-features/vector-stores' },
      { title: 'Guardrails', path: '/api-features/guardrails' },
    ],
  },
  {
    title: 'Agents SDK',
    path: '/agents-sdk',
    children: [
      { title: 'Installation', path: '/agents-sdk/installation' },
      { title: 'Agent Class', path: '/agents-sdk/agent-class' },
      { title: 'Runner Class', path: '/agents-sdk/runner-class' },
      { title: 'Function Tools', path: '/agents-sdk/function-tools' },
      { title: 'Handoffs', path: '/agents-sdk/handoffs' },
    ],
  },
  {
    title: 'Architecture',
    path: '/architecture',
    children: [
      { title: 'System Overview', path: '/architecture/overview' },
      {
        title: 'Tender Writing Workflow',
        path: '/architecture/tender-workflow',
      },
      { title: 'Integration Points', path: '/architecture/integration-points' },
    ],
  },
  {
    title: 'Best Practices',
    path: '/best-practices',
    children: [
      { title: 'Security', path: '/best-practices/security' },
      { title: 'Rate Limits & Scaling', path: '/best-practices/rate-limits' },
      { title: 'Error Handling', path: '/best-practices/error-handling' },
      { title: 'Cost Optimization', path: '/best-practices/cost-optimization' },
      { title: 'Testing', path: '/best-practices/testing' },
    ],
  },
  {
    title: 'Lovable Integration',
    path: '/integration',
    children: [
      { title: 'UI Components', path: '/integration/ui-components' },
      { title: 'Backend Integration', path: '/integration/backend' },
      { title: 'Workflow Integration', path: '/integration/workflow' },
      { title: 'Deployment', path: '/integration/deployment' },
    ],
  },
];

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="relative p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full h-9 pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {navItems.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarMenu>
                {section.children?.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                    >
                      <Link to={item.path}>
                        <ChevronRight className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
