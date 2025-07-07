'use client'
import { FaChurch } from 'react-icons/fa'  // importer l'icône church
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useEffect } from 'react'
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap'
import useSignIn from './useSignIn'

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const { loading, login, control } = useSignIn()

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                <div className="mx-auto mb-4 text-center auth-logo" style={{ fontSize: '48px', color: '#dc3545' }}>
                  <Link href="/dashboards/analytics" aria-label="Go to analytics dashboard">
                    <FaChurch size={48} color="#dc3545" />
                  </Link>
                </div>
                <h2 className="fw-bold text-uppercase text-center fs-18">Se connecter</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  Entrez votre Adresse mail et mot de passe pour se connecter.
                </p>
                <div className="px-4">
                  <form className="authentication-form" onSubmit={login}>
                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="email"
                        placeholder="Adresse mail"
                        className="bg-light bg-opacity-50 border-light py-2"
                        label="Adresse mail"
                      />
                    </div>
                    <div className="mb-3">
                      <Link href="/auth/reset-password" className="float-end text-muted text-unline-dashed ms-1">
                        Mot de passe oublié
                      </Link>
                      <TextFormInput
                        control={control}
                        name="password"
                        placeholder="Mot de passe"
                        className="bg-light bg-opacity-50 border-light py-2"
                        label="Mot de passe"
                      />
                    </div>
                    <div className="mb-1 text-center d-grid">
                      <button disabled={loading} className="btn btn-danger py-2 fw-medium" type="submit">
                        Se connecter
                      </button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SignIn
