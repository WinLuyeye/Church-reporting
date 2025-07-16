'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Form } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useEffect, useState } from 'react'

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

// Schéma de validation
const schema = yup.object({
  nom: yup.string().required('Veuillez entrer le nom'),
  pays: yup.string().required('Veuillez sélectionner le pays'),
  province: yup.string().required('Veuillez sélectionner la province'),
  ville: yup.string().required('Veuillez entrer la ville'),
  commune: yup.string().required('Veuillez entrer la commune'),
  avenue: yup.string().required('Veuillez entrer l’avenue'),
  type: yup.string().oneOf(['International', 'national']).required('Veuillez sélectionner le type'),
  pasteurId: yup.string().required('Veuillez sélectionner un pasteur'),
})

type FormData = yup.InferType<typeof schema>
type SessionUserWithToken = { accessToken: string }
type CustomSession = { user: SessionUserWithToken } | null

const provincesRDC = [
  'Kinshasa',
  'Kongo Central',
  'Kwilu',
  'Kwango',
  'Mai-Ndombe',
  'Équateur',
  'Mongala',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Tshopo',
  'Bas-Uele',
  'Haut-Uele',
  'Ituri',
  'Nord-Kivu',
  'Sud-Kivu',
  'Maniema',
  'Tanganyika',
  'Haut-Lomami',
  'Lomami',
  'Sankuru',
  'Haut-Katanga',
  'Lualaba',
]

const countriesList = [
  'Afrique du Sud',
  'Allemagne',
  'Arabie Saoudite',
  'Argentine',
  'Australie',
  'Belgique',
  'Brésil',
  'Canada',
  'Chine',
  'Colombie',
  'Côte d’Ivoire',
  'Danemark',
  'Égypte',
  'Espagne',
  'États-Unis',
  'Éthiopie',
  'France',
  'Ghana',
  'Inde',
  'Indonésie',
  'Irlande',
  'Italie',
  'Japon',
  'Kenya',
  'Maroc',
  'Mexique',
  'Nigeria',
  'Norvège',
  'Nouvelle-Zélande',
  'Pays-Bas',
  'Portugal',
  'République démocratique du Congo',
  'Royaume-Uni',
  'Russie',
  'Sénégal',
  'Singapour',
  'Suède',
  'Suisse',
  'Togo',
  'Tunisie',
  'Turquie',
  'Ukraine',
  'Zambie',
  'Zimbabwe',
].sort((a, b) => a.localeCompare(b))

export default function AgentAdd() {
  const { data: session } = useSession() as { data: CustomSession }
  const { showNotification } = useNotificationContext()
  const [pasteurs, setPasteurs] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchPasteurs() {
      if (!session?.user?.accessToken) return
  
      try {
        const res = await fetch(`${BASE_API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        })
        
        const json = await res.json() // <- Important
        console.log('Réponse JSON :', json)
        
        console.log(":::::", res);
        if (!res.ok) {
          console.error("Erreur lors de la récupération des pasteurs.")
          return
        }
  
        const pasteursPrincipaux = json.data
        .filter((user: any) => user.roles === 'PASTEUR_PRINCIPAL')
        .map((user: any) => ({
          id: user.id,
          name: `${user.nom} ${user.prenom}`
        }))
      setPasteurs(pasteursPrincipaux)
      
      } catch (e) {
        console.error("Erreur fetchPasteurs:", e)
      }
    }
  
    fetchPasteurs()
  }, [session])  

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.accessToken) {
      showNotification({ message: 'Session invalide', variant: 'danger' })
      return
    }
    const payload = {
      nom: data.nom,
      pays: data.pays,
      province: data.province,
      ville: data.ville,
      commune: data.commune,
      avenue: data.avenue,
      type: data.type,
      egliseCentrId: session.user.accessToken /* ou ID dans session */,
      userId: data.pasteurId,
    }
    try {
      const res = await fetch(`${BASE_API_URL}/extensions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw res
      showNotification({ message: 'Agent créé 🎉', variant: 'success' })
      reset()
    } catch (err) {
      console.error(err)
      showNotification({ message: 'Erreur lors de la création', variant: 'danger' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as="h4">Créer un Agent</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6} className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Controller control={control} name="nom" render={({ field }) => <Form.Control {...field} isInvalid={!!errors.nom} />} />
              <Form.Control.Feedback type="invalid">{errors.nom?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Pays</Form.Label>
              <Controller
                control={control}
                name="pays"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.pays}>
                    <option value="">Sélectionnez un pays</option>
                    {countriesList.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.pays?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Province (RDC)</Form.Label>
              <Controller
                control={control}
                name="province"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.province}>
                    <option value="">Sélectionnez une province</option>
                    {provincesRDC.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.province?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Ville</Form.Label>
              <Controller control={control} name="ville" render={({ field }) => <Form.Control {...field} isInvalid={!!errors.ville} />} />
              <Form.Control.Feedback type="invalid">{errors.ville?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Commune</Form.Label>
              <Controller control={control} name="commune" render={({ field }) => <Form.Control {...field} isInvalid={!!errors.commune} />} />
              <Form.Control.Feedback type="invalid">{errors.commune?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Avenue</Form.Label>
              <Controller control={control} name="avenue" render={({ field }) => <Form.Control {...field} isInvalid={!!errors.avenue} />} />
              <Form.Control.Feedback type="invalid">{errors.avenue?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Type</Form.Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.type}>
                    <option value="">Sélectionnez un type</option>
                    <option value="International">International</option>
                    <option value="national">National</option>
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.type?.message}</Form.Control.Feedback>
            </Col>

            <Col lg={6} className="mb-3">
              <Form.Label>Pasteur principal</Form.Label>
              <Controller
                control={control}
                name="pasteurId"
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.pasteurId}>
                    <option value="">Sélectionnez un pasteur</option>
                    {pasteurs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.pasteurId?.message}</Form.Control.Feedback>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="justify-content-end g-2 mt-3">
        <Col lg={2}>
          <Button type="submit" variant="primary" className="w-100">
            Créer
          </Button>
        </Col>
        <Col lg={2}>
          <Button variant="outline-danger" className="w-100" onClick={() => reset()}>
            Annuler
          </Button>
        </Col>
      </Row>
    </form>
  )
}
