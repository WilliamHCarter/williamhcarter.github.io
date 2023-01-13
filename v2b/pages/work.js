import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/grid-item'
import thumbBbot from '/public/BBOT.png'

const Work = () => (
  <Layout title="Work">
    <Container maxW="container.lg">
      <Heading as="h3" fontSize={20} mb={4}>
        Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem id="https://github.com/JackMansfield2019/BrokerBot" title="BrokerBot" thumbnail={thumbBbot}>
            Autonomous trading alogrithms system utilizing backtesting via the Alpaca API.
          </WorkGridItem>
        </Section>
        <Section>
          <WorkGridItem id="brokerbot" title="BrokerBot" thumbnail={thumbBbot}>
            Autonomous trading alogrithms system utilizing backtesting via the Alpaca API.
          </WorkGridItem>
        </Section>
        
      </SimpleGrid>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../components/chakra'