import { notFound } from 'next/navigation'
import { getPublicPortfolioBySlug } from '@/lib/portfolio'
import { 
  MinimalTemplate, 
  AuroraTemplate, 
  MidnightTemplate, 
  EditorialTemplate, 
  SplitTemplate 
} from '@/components/templates/PortfolioTemplates'

type Params = Promise<{ slug: string }>

export default async function PublicPortfolioPage({ params }: { params: Params }) {
  const { slug } = await params
  const portfolio = await getPublicPortfolioBySlug(slug)

  if (!portfolio || !portfolio.isPublished) {
    notFound()
  }

  // Cast prisma types to match client props expectations
  const portfolioData = {
    title: portfolio.title,
    description: portfolio.description,
    template: portfolio.template,
    slug: portfolio.slug,
    createdAt: portfolio.createdAt,
    user: {
      name: portfolio.user.name,
      email: portfolio.user.email,
      profile: portfolio.user.profile
    },
    projects: portfolio.projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      link: project.link,
      createdAt: project.createdAt
    }))
  }

  // Render the selected visual template
  switch (portfolio.template) {
    case 'MINIMAL':
      return <MinimalTemplate portfolio={portfolioData} />
    case 'AURORA':
      return <AuroraTemplate portfolio={portfolioData} />
    case 'MIDNIGHT':
      return <MidnightTemplate portfolio={portfolioData} />
    case 'EDITORIAL':
      return <EditorialTemplate portfolio={portfolioData} />
    case 'SPLIT':
      return <SplitTemplate portfolio={portfolioData} />
    default:
      return <MinimalTemplate portfolio={portfolioData} />
  }
}
