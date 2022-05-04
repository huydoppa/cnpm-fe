import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Product Management',
    to: '/product-management',
    icon: 'cil-scrubber',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Service Management',
    to: '/service-management',
    icon: 'cil-scrubber',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Product Order',
    to: '/product-order',
    icon: 'cil-scrubber',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Service Order',
    to: '/service-order',
    icon: 'cil-scrubber',
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Base',
  //   route: '/base',
  //   icon: 'cil-puzzle',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Labels']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label danger',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-danger'
  //   },
  //   label: true
  // },
]

export default _nav
