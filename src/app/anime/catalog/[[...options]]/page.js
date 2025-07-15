import React from 'react'
import NetflixStyleCatalog from '@/components/catalogcomponent/NetflixStyleCatalog'
import Navbarcomponent from '@/components/navbar/Navbar'

export async function generateMetadata({ params }) {
  return {
    title: "SkyAnime - Catalog",
    openGraph: {
      title: "SkyAnime - Catalog",
    },
    twitter: {
      card: "summary",
      title: "SkyAnime - Catalog",
    },
  }
}

function page({searchParams}) {
  return (
    <div>
      <Navbarcomponent/>
      <div className='mt-[70px]'>
        <NetflixStyleCatalog searchParams={searchParams}/>
      </div>
    </div>
  )
}

export default page
