import { GetStaticProps } from 'next';
import Head from 'next/head';
import { wpService, FilterData } from '@/services/wpService';
import { adminService } from '@/services/adminService';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HomePage from '@/components/pages/HomePage';
import SchemaMarkup from '@/components/SEO/SchemaMarkup';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/utils/schemaUtils';

interface HomePageProps {
  articles: any[];
  filterData: FilterData | null;
  settings: any;
}

export default function Home({ articles, filterData, settings }: HomePageProps) {
  return (
    <>
      <Head>
        <title>{settings.homeTitle}</title>
        <meta name="description" content={settings.homeDescription} />
        <meta property="og:title" content={settings.homeTitle} />
        <meta property="og:description" content={settings.homeDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nexjob.tech/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings.homeTitle} />
        <meta name="twitter:description" content={settings.homeDescription} />
        <link rel="canonical" href="https://nexjob.tech/" />
      </Head>
      
      <SchemaMarkup schema={generateWebsiteSchema(settings)} />
      <SchemaMarkup schema={generateOrganizationSchema()} />
      
      <Header />
      <main>
        <HomePage 
          initialArticles={articles} 
          initialFilterData={filterData}
          settings={settings}
        />
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const settings = adminService.getSettings();
    
    // Initialize wpService with settings
    wpService.setBaseUrl(settings.apiUrl);
    wpService.setFiltersApiUrl(settings.filtersApiUrl);
    wpService.setAuthToken(settings.authToken);
    
    // Fetch data
    const [articles, filterData] = await Promise.all([
      wpService.getArticles(3),
      wpService.getFiltersData()
    ]);

    return {
      props: {
        articles,
        filterData,
        settings
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    return {
      props: {
        articles: [],
        filterData: null,
        settings: adminService.getSettings()
      },
      revalidate: 300, // Retry in 5 minutes on error
    };
  }
};