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
  Modal,
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
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const fetchUsers = async () => {
    if (!token) return
    try {
      const res = await fetch(`${BASE_API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await res.json()
      if (res.ok) setUsers(result.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [session])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nom} ${user.postnom} ${user.prenom}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser || !token) return
    try {
      const res = await fetch(`${BASE_API_URL}/users/delete/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
console.log(":::::::", selectedUser.id);

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
      } else {
        const result = await res.json()
        console.error('Erreur de suppression :', result.message)
      }
    } catch (error) {
      console.error('Erreur réseau :', error)
    }

    setShowModal(false)
    setSelectedUser(null)
  }

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
    })

    doc.save('utilisateurs.pdf')
  }

  const exportToExcel = () => {
    const header = ['Nom Complet', 'Email', 'Téléphone', 'Sexe', 'Rôle']
    const data = users.map(u => [
      `${u.nom} ${u.postnom} ${u.prenom}`,
      u.email,
      u.telephone,
      u.sexe,
      Array.isArray(u.roles) ? u.roles.join(', ') : u.roles,
    ])
    const ws = XLSX.utils.aoa_to_sheet([header, ...data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'utilisateurs.xlsx')
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
                <div className="input-group input-group-sm" style={{ width: '350px' }}>
                  <span className="input-group-text bg-light border-end-0">
                    <IconifyIcon icon="ri:search-line" width={16} height={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Rechercher par nom complet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="light" size="sm" onClick={fetchUsers}>
                    <IconifyIcon icon="solar:refresh-circle-broken" className="align-middle fs-18" />
                  </Button>
                </div>
                <Dropdown>
                  <DropdownToggle
                    as={'a'}
                    className="btn btn-sm btn-outline-light rounded content-none icons-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
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
                      <th>Téléphone</th>
                      <th>Sexe</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {user.image && (
                                <Image src={user.image} alt="avatar" width={40} height={40} className="rounded-circle" />
                              )}
                              <span>{user.nom} {user.postnom} {user.prenom}</span>
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
                              <Button variant="soft-danger" size="sm" onClick={() => handleDeleteClick(user)}>
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
              <nav>
                <ul className="pagination justify-content-end mb-0">
                  <li className="page-item disabled">
                    <Link className="page-link" href="#">Précédent</Link>
                  </li>
                  <li className="page-item active">
                    <Link className="page-link" href="#">1</Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">Suivant</Link>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              Êtes-vous sûr de vouloir supprimer <strong>{selectedUser.nom} {selectedUser.postnom} {selectedUser.prenom}</strong> ?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CustomersListPage
