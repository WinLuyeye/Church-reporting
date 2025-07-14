'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Form } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useNotificationContext } from '@/context/useNotificationContext'

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

const schema = yup.object({
  nom: yup.string().required('Veuillez entrer le nom'),
  postnom: yup.string().required('Veuillez entrer le postnom'),
  prenom: yup.string().required('Veuillez entrer le prénom'),
  sexe: yup
    .string()
    .oneOf(['MASCULIN', 'FEMININ'], 'Sexe invalide')
    .required('Veuillez sélectionner le sexe'),
  telephone: yup.string().required('Veuillez entrer le téléphone'),
  email: yup.string().email('Email invalide').required("Veuillez entrer l'email"),
  image: yup.string().url('URL invalide').required("Veuillez entrer l'URL de l'image"),
  password: yup.string().min(6, 'Mot de passe trop court').required('Veuillez entrer le mot de passe'),
  roles: yup
    .string()
    .oneOf(['EGLISE_CENTRALE', 'PASTEUR_PRINCIPAL', 'CHEF_DE_DEPARTEMENT', 'PASTEUR_1'], 'Rôle invalide')
    .required('Veuillez sélectionner un rôle'),
})

type FormData = yup.InferType<typeof schema>

type SessionUserWithToken = {
  accessToken: string
  email?: string
  name?: string
}

type CustomSession = {
  user: SessionUserWithToken
} | null

const AddCustomer = () => {
  const { data: session } = useSession() as { data: CustomSession }
  const { showNotification } = useNotificationContext()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset, // <- Ajouté ici
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    console.log('Données du formulaire:', data)

    if (!session?.user?.accessToken) {
      alert('Session invalide ou expirée, veuillez vous reconnecter.')
      return
    }

    try {
      const res = await fetch(`${BASE_API_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Erreur du serveur:', errorData)
        showNotification({ message: "Erreur lors de la création de l'utilisateur", variant: 'danger' })
        return
      }

      const result = await res.json()
      console.log('Utilisateur créé:', result)
      showNotification({ message: 'Utilisateur créé avec succès !', variant: 'success' })

      reset() // <- Réinitialise le formulaire ici

    } catch (error) {
      console.error('Erreur réseau:', error)
      showNotification({ message: 'Erreur réseau lors de la création', variant: 'danger' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as="h4">Informations Utilisateur</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={4} className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Controller
                control={control}
                name="nom"
                render={({ field }) => (
                  <Form.Control type="text" placeholder="Nom" {...field} isInvalid={!!errors.nom} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.nom?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={4} className="mb-3">
              <Form.Label>Postnom</Form.Label>
              <Controller
                control={control}
                name="postnom"
                render={({ field }) => (
                  <Form.Control type="text" placeholder="Postnom" {...field} isInvalid={!!errors.postnom} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.postnom?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={4} className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Controller
                control={control}
                name="prenom"
                render={({ field }) => (
                  <Form.Control type="text" placeholder="Prénom" {...field} isInvalid={!!errors.prenom} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.prenom?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={4} className="mb-3">
              <Form.Label>Sexe</Form.Label>
              <Controller
                control={control}
                name="sexe"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.sexe}>
                    <option value="">Sélectionner le sexe</option>
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.sexe?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={4} className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Controller
                control={control}
                name="telephone"
                render={({ field }) => (
                  <Form.Control type="tel" placeholder="+243852345678" {...field} isInvalid={!!errors.telephone} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.telephone?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={4} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Form.Control type="email" placeholder="user@example.com" {...field} isInvalid={!!errors.email} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/image.png"
                    {...field}
                    isInvalid={!!errors.image}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.image?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Form.Control type="password" placeholder="Mot de passe" {...field} isInvalid={!!errors.password} />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Controller
                control={control}
                name="roles"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.roles}>
                    <option value="">Sélectionner un rôle</option>
                    <option value="EGLISE_CENTRALE">EGLISE_CENTRALE</option>
                    <option value="PASTEUR_PRINCIPAL">PASTEUR_PRINCIPAL</option>
                    <option value="CHEF_DE_DEPARTEMENT">CHEF_DE_DEPARTEMENT</option>
                    <option value="PASTEUR_1">PASTEUR_1</option>
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.roles?.message}</Form.Control.Feedback>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" type="submit" className="w-100">
              Créer l&apos;utilisateur
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="danger"
              className="w-100"
              type="button"
              onClick={() => {
                window.location.reload()
              }}
            >
              Annuler
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  )
}

export default AddCustomer
