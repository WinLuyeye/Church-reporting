'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { statisticData, StatisticType } from '../data'

const StatCard = ({ amount, change, icon, title, variant }: StatisticType) => {
  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 56,
              height: 56,
              // backgroundColor: '#e9f0ff',
            }}
          >
            <IconifyIcon
              icon={icon}
              width={28}
              height={28}
              className="text-primary"
              style={{ color: '#0d6efd' }} 
            />
          </div>

          <div>
            <p className="text-muted mb-1">{title}</p>
            <h5 className="text-dark fw-bold d-flex align-items-center gap-2 mb-0">
              {amount}{' '}
              <span
                className={`badge text-${variant === 'danger' ? 'danger' : 'success'} bg-${variant === 'danger' ? 'danger' : 'success'}-subtle fs-12`}>
                <IconifyIcon icon={variant === 'danger' ? 'ri:arrow-down-line' : 'ri:arrow-up-line'} />
                {change}%
              </span>
            </h5>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const Statistics = () => {
  return (
    <Row>
      {statisticData.map((item, idx) => (
        <Col md={6} xl={3} key={idx}>
          <StatCard {...item} />
        </Col>
      ))}
    </Row>
  )
}

export default Statistics
