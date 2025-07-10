import FileUpload from '@/components/FileUpload'
import PageTitle from '@/components/PageTitle'
import CustomerAddCard from './components/CustomerAddCard'
import AddCustomer from './components/AddCustomer'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ajouter un utilisateur' }

const CustomerAddPage = () => {
  return (
    <>
      <PageTitle title="Ajouter un utilisateur" subName="Real Estate" />
      <Row>
        {/* <CustomerAddCard /> */}
        <Col xl={9} lg={12}>
          {/* <FileUpload title="Add Customer Photo" /> */}
          <AddCustomer />
        </Col>
      </Row>
    </>
  )
}

export default CustomerAddPage
