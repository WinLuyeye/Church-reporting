import PageTitle from '@/components/PageTitle'
import CustomersDetails from './components/CustomersDetails'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customer Overview' }

const CustomerDetailsPage = () => {
  return (
    <>
      <PageTitle subName="Customers" title="Customer Overview" />
      <Row className="justify-content-center">
          <Col xl={8} lg={10}>
            <div className="shadow-sm rounded p-4">
              <CustomersDetails />
            </div>
          </Col>
        </Row>
    </>
  )
}

export default CustomerDetailsPage
