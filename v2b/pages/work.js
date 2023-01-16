import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/grid-item'
import thumbBbot from '/public/BBOT2.png'
import thumbCrossWalk from '/public/Crosswalk.png'

const Work = () => (
  <Layout title="Work">
    <Container maxW="container.lg" p={0}>
    <Heading as="h3" variant="section-title">
                Work
            </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem id="https://github.com/JackMansfield2019/BrokerBot" title="BrokerBot" thumbnail={thumbBbot}>
            Autonomous trading alogrithms system utilizing backtesting via the Alpaca API.
          </WorkGridItem>
        </Section>
        <Section>
          <WorkGridItem id="https://github.com/WilliamHCarter/LD46" title="Crosswalk" thumbnail={thumbCrossWalk}>
            Experimental physics game created with Unity for Ludum Dare 46.
          </WorkGridItem>
        </Section>
        
      </SimpleGrid>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../components/chakra'