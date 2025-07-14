'use client'

import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

type UserType = {
  id: string
  nom: string
  postnom: string
  prenom: string
  email: string
  telephone: string
  sexe: string
  roles: string | string[]
  image?: string
}

type SessionUser = {
  id: string
  email: string
  name: string
  role: string | string[]
  accessToken: string
  firstName: string
  lastName: string
  sexe?: string
  telephone?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

const CustomersListPage = () => {
  const { data: session } = useSession()
  const token = (session?.user as SessionUser)?.accessToken

  const [users, setUsers] = useState<UserType[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const token = (session?.user as SessionUser | undefined)?.accessToken

      if (!token) {
        console.warn('Token invalide ou manquant.')
        return
      }

      try {
        const res = await fetch(`${BASE_API_URL}/users/all`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const result = await res.json()
        if (res.ok) {
          setUsers(result.data)
        } else {
          console.error('Erreur API :', result.message)
        }
      } catch (err) {
        console.error('Erreur réseau :', err)
      }
    }

    fetchUsers()
  }, [session])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nom} ${user.postnom} ${user.prenom}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Liste des Utilisateurs', 14, 15)

    autoTable(doc, {
      startY: 25,
      head: [['Nom Complet', 'Email', 'Téléphone', 'Sexe', 'Rôle']],
      body: users.map(u => [
        `${u.nom} ${u.postnom} ${u.prenom}`,
        u.email,
        u.telephone,
        u.sexe,
        Array.isArray(u.roles) ? u.roles.join(', ') : u.roles,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })

    doc.save('utilisateurs.pdf')
  }

  const exportToExcel = () => {
    if (users.length === 0) return

    const header = ['Nom Complet', 'Email', 'Numéro de téléphone', 'Sexe', 'Rôle']
    const data = users.map(u => [
      `${u.nom} ${u.postnom} ${u.prenom}`,
      u.email,
      u.telephone,
      u.sexe,
      Array.isArray(u.roles) ? u.roles.join(', ') : u.roles,
    ])

    const ws = XLSX.utils.aoa_to_sheet([header, ...data])

    const headerStyle = {
      fill: { fgColor: { rgb: '2980B9' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
      alignment: { vertical: 'center', horizontal: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    }

    const bodyStyle = {
      alignment: { vertical: 'center', horizontal: 'left' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    }

    for (let col = 0; col < header.length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
      if (!ws[cellRef]) continue
      ws[cellRef].s = headerStyle
    }

    for (let row = 1; row <= data.length; row++) {
      for (let col = 0; col < header.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
        if (!ws[cellRef]) continue
        ws[cellRef].s = { ...bodyStyle }
        if (row % 2 === 0) {
          ws[cellRef].s.fill = { fgColor: { rgb: 'F5F5F5' } }
        }
      }
    }

    ws['!cols'] = [
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs')

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    saveAs(blob, 'utilisateurs.xlsx')
  }

  return (
    <>
      <PageTitle subName="Utilisateurs" title="Liste de utilisateurs" />
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
              <CardTitle as="h4">Liste de tous les utilisateurs</CardTitle>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="text"
                  placeholder="Rechercher par nom complet..."
                  className="form-control form-control-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: '250px' }}
                />
                <Dropdown>
                  <DropdownToggle
                    as={'a'}
                    className="btn btn-sm btn-outline-light rounded content-none icons-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Export <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={exportToExcel}>Exporter en Excel</DropdownItem>
                    <DropdownItem onClick={exportToPDF}>Exporter en PDF</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Photo &amp; Nom Complet</th>
                      <th>Email</th>
                      <th>Numéro de téléphone</th>
                      <th>Sexe</th>
                      <th>Rôle</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, idx) => (
                        <tr key={user.id || idx}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div>
                                {user.image && (
                                  <Image
                                    src={user.image}
                                    alt="avatar"
                                    className="avatar-sm rounded-circle"
                                    width={40}
                                    height={40}
                                  />
                                )}
                              </div>
                              <div>
                                <Link href="#" className="text-dark fw-medium fs-15">
                                  {user.nom} {user.postnom} {user.prenom}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.telephone}</td>
                          <td>{user.sexe}</td>
                          <td>{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button variant="light" size="sm">
                                <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                              </Button>
                              <Button variant="soft-primary" size="sm">
                                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                              </Button>
                              <Button variant="soft-danger" size="sm">
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>

            <CardFooter>
              <nav aria-label="Pagination">
                <ul className="pagination justify-content-end mb-0">
                  <li className="page-item disabled">
                    <Link className="page-link" href="#">
                      Précédent
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link className="page-link" href="#">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      Suivant
                    </Link>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CustomersListPage
