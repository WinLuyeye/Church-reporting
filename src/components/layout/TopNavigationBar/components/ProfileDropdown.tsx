'use client'

import { useSession, signOut } from 'next-auth/react'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import Link from 'next/link'
import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'react-bootstrap'

const ProfileDropdown = () => {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Utilisateur'

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/sign-in' })
  }

  return (
    <Dropdown className="topbar-item" drop="down">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image className="rounded-circle" width={32} src={avatar1} alt="avatar" />
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as={'h6'} className="dropdown-header">
          Welcome {userName} !
        </DropdownHeader>

        <div className="dropdown-divider my-1" />

        <DropdownItem as={Link} href="/profile/settings">
          <IconifyIcon icon="solar:settings-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Mon Compte</span>
        </DropdownItem>

        <div className="dropdown-divider my-1" />

        <DropdownItem onClick={handleSignOut} className="text-danger" style={{ cursor: 'pointer' }}>
          <IconifyIcon icon="solar:logout-3-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">Se Déconnecter</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown