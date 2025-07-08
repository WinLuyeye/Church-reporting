import PageTitle from '@/components/PageTitle'
import { Col, Row } from 'react-bootstrap'
import RecentAgent from './components/RecentAgent'
import Statistics from './components/Statistics'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Agent' }

const AgentPage = () => {
  return (
    <>
      <PageTitle title="Agent" subName="Dashboards" />
      <Row>
        <Statistics />
      </Row>
      <Row>
        <Col>
          <RecentAgent />
        </Col>
      </Row>
    </>
  )
}

export default AgentPage
